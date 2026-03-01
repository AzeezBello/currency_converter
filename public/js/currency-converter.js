(function currencyConverterApp() {
  'use strict';

  var CACHE_TTL_MS = 30 * 60 * 1000;
  var STORAGE_KEY = 'currency-converter-rates-v1';
  var inMemoryCache = {};
  var inflightByBase = {};

  function getElement(id) {
    return document.getElementById(id);
  }

  function readStoredCache() {
    try {
      var parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      return parsed && typeof parsed === 'object' ? parsed : {};
    } catch (error) {
      return {};
    }
  }

  function writeStoredCache(cache) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cache));
    } catch (error) {
      // Ignore storage quota errors and continue with memory cache.
    }
  }

  function getCachedRates(baseCurrency) {
    var now = Date.now();
    var memoryEntry = inMemoryCache[baseCurrency];
    if (memoryEntry && now - memoryEntry.timestamp < CACHE_TTL_MS) {
      return memoryEntry.rates;
    }

    var storedCache = readStoredCache();
    var storedEntry = storedCache[baseCurrency];
    if (storedEntry && now - storedEntry.timestamp < CACHE_TTL_MS) {
      inMemoryCache[baseCurrency] = storedEntry;
      return storedEntry.rates;
    }

    return null;
  }

  function cacheRates(baseCurrency, rates) {
    var cacheEntry = {
      timestamp: Date.now(),
      rates: rates
    };

    inMemoryCache[baseCurrency] = cacheEntry;
    var storedCache = readStoredCache();
    storedCache[baseCurrency] = cacheEntry;
    writeStoredCache(storedCache);
  }

  async function fetchRatesFromOpenErApi(baseCurrency) {
    var response = await fetch('https://open.er-api.com/v6/latest/' + encodeURIComponent(baseCurrency));
    if (!response.ok) {
      throw new Error('Primary API request failed with status ' + response.status);
    }

    var data = await response.json();
    if (!data || data.result !== 'success' || !data.rates) {
      throw new Error('Primary API returned an unexpected payload');
    }

    return data.rates;
  }

  async function fetchRatesFromFrankfurter(baseCurrency) {
    var response = await fetch('https://api.frankfurter.app/latest?from=' + encodeURIComponent(baseCurrency));
    if (!response.ok) {
      throw new Error('Fallback API request failed with status ' + response.status);
    }

    var data = await response.json();
    if (!data || !data.rates) {
      throw new Error('Fallback API returned an unexpected payload');
    }

    // Frankfurter does not include base currency in the rates object.
    data.rates[baseCurrency] = 1;
    return data.rates;
  }

  async function getRates(baseCurrency, forceRefresh) {
    if (!forceRefresh) {
      var cachedRates = getCachedRates(baseCurrency);
      if (cachedRates) {
        return cachedRates;
      }
    }

    if (inflightByBase[baseCurrency]) {
      return inflightByBase[baseCurrency];
    }

    inflightByBase[baseCurrency] = (async function () {
      try {
        var rates;
        try {
          rates = await fetchRatesFromOpenErApi(baseCurrency);
        } catch (primaryError) {
          rates = await fetchRatesFromFrankfurter(baseCurrency);
        }

        cacheRates(baseCurrency, rates);
        return rates;
      } finally {
        delete inflightByBase[baseCurrency];
      }
    })();

    return inflightByBase[baseCurrency];
  }

  function parseAmount(inputValue) {
    if (typeof inputValue !== 'string') {
      return null;
    }

    var normalized = inputValue.trim();
    if (normalized.length === 0) {
      return null;
    }

    var amount = Number(normalized);
    if (!Number.isFinite(amount) || amount < 0) {
      return null;
    }

    return amount;
  }

  function formatAmount(amount, currencyCode) {
    try {
      return new Intl.NumberFormat(undefined, {
        style: 'currency',
        currency: currencyCode,
        maximumFractionDigits: 2
      }).format(amount);
    } catch (error) {
      return amount.toFixed(2) + ' ' + currencyCode;
    }
  }

  function setButtonLoading(buttonElement, isLoading) {
    if (!buttonElement) {
      return;
    }

    if (isLoading) {
      buttonElement.disabled = true;
      buttonElement.dataset.originalText = buttonElement.textContent;
      buttonElement.textContent = 'Converting...';
      return;
    }

    buttonElement.disabled = false;
    buttonElement.textContent = buttonElement.dataset.originalText || 'Convert';
  }

  function setStatusText(statusElement, message, isError) {
    if (!statusElement) {
      return;
    }

    statusElement.textContent = message || '';
    statusElement.style.color = isError ? '#dc3545' : '#6c757d';
  }

  async function convertCurrency(forceRefresh) {
    var fromElement = getElement('from');
    var toElement = getElement('to');
    var amountElement = getElement('amount');
    var resultElement = getElement('result');
    var statusElement = getElement('status-message');
    var buttonElement = getElement('convert-btn');

    if (!fromElement || !toElement || !amountElement || !resultElement) {
      return;
    }

    var fromCurrency = fromElement.value;
    var toCurrency = toElement.value;
    var amount = parseAmount(amountElement.value);

    if (amount === null) {
      resultElement.value = '';
      setStatusText(statusElement, 'Enter a valid amount (0 or more).', true);
      return;
    }

    if (fromCurrency === toCurrency) {
      resultElement.value = formatAmount(amount, toCurrency);
      setStatusText(statusElement, 'No conversion needed for the same currency.', false);
      return;
    }

    setButtonLoading(buttonElement, true);
    setStatusText(statusElement, 'Fetching latest rates...', false);

    try {
      var rates = await getRates(fromCurrency, !!forceRefresh);
      var rate = rates[toCurrency];

      if (typeof rate !== 'number') {
        throw new Error('Missing rate for selected currency pair');
      }

      var convertedAmount = amount * rate;
      resultElement.value = formatAmount(convertedAmount, toCurrency);
      setStatusText(statusElement, 'Rate updated successfully.', false);
    } catch (error) {
      resultElement.value = '';
      setStatusText(statusElement, 'Unable to fetch live rates. Check your connection and try again.', true);
    } finally {
      setButtonLoading(buttonElement, false);
    }
  }

  function debounce(fn, waitMs) {
    var timerId;
    return function debounced() {
      var context = this;
      var args = arguments;
      clearTimeout(timerId);
      timerId = setTimeout(function () {
        fn.apply(context, args);
      }, waitMs);
    };
  }

  function registerServiceWorker() {
    if (!('serviceWorker' in navigator)) {
      return;
    }

    window.addEventListener('load', function () {
      navigator.serviceWorker.register('/sw.js').catch(function () {
        // Avoid blocking app functionality when SW registration fails.
      });
    });
  }

  function setupEventHandlers() {
    var amountElement = getElement('amount');
    var fromElement = getElement('from');
    var toElement = getElement('to');
    var buttonElement = getElement('convert-btn');

    if (!amountElement || !fromElement || !toElement || !buttonElement) {
      return;
    }

    var debouncedConvert = debounce(function () {
      convertCurrency(false);
    }, 300);

    buttonElement.addEventListener('click', function () {
      convertCurrency(false);
    });
    amountElement.addEventListener('input', debouncedConvert);
    fromElement.addEventListener('change', function () {
      convertCurrency(false);
    });
    toElement.addEventListener('change', function () {
      convertCurrency(false);
    });
  }

  function init() {
    setupEventHandlers();
    registerServiceWorker();
    window.convertCurrency = function () {
      return convertCurrency(false);
    };
    convertCurrency(false);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
