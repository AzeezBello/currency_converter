(function currencyConverterApp() {
  'use strict';

  var CACHE_TTL_MS = 30 * 60 * 1000;
  var STORAGE_KEY = 'currency-converter-rates-v1';
  var DEFAULT_FROM = 'USD';
  var DEFAULT_TO = 'PHP';
  var BENCHMARK_CODES = ['USD', 'EUR', 'GBP', 'JPY', 'CHF', 'CAD', 'NGN', 'PHP'];

  var CURRENCY_NAMES = {
    AED: 'UAE Dirham',
    AFN: 'Afghan Afghani',
    ALL: 'Albanian Lek',
    AMD: 'Armenian Dram',
    ANG: 'Netherlands Antillean Guilder',
    AOA: 'Angolan Kwanza',
    ARS: 'Argentine Peso',
    AUD: 'Australian Dollar',
    AWG: 'Aruban Florin',
    AZN: 'Azerbaijani Manat',
    BAM: 'Bosnia-Herzegovina Mark',
    BBD: 'Barbadian Dollar',
    BDT: 'Bangladeshi Taka',
    BGN: 'Bulgarian Lev',
    BHD: 'Bahraini Dinar',
    BIF: 'Burundian Franc',
    BND: 'Brunei Dollar',
    BOB: 'Bolivian Boliviano',
    BRL: 'Brazilian Real',
    BSD: 'Bahamian Dollar',
    BTC: 'Bitcoin',
    BTN: 'Bhutanese Ngultrum',
    BWP: 'Botswanan Pula',
    BYN: 'Belarusian Ruble',
    BYR: 'Belarusian Ruble (2000–2016)',
    BZD: 'Belize Dollar',
    CAD: 'Canadian Dollar',
    CDF: 'Congolese Franc',
    CHF: 'Swiss Franc',
    CLP: 'Chilean Peso',
    CNY: 'Chinese Yuan',
    COP: 'Colombian Peso',
    CRC: 'Costa Rican Colón',
    CUP: 'Cuban Peso',
    CVE: 'Cape Verdean Escudo',
    CZK: 'Czech Koruna',
    DJF: 'Djiboutian Franc',
    DKK: 'Danish Krone',
    DOP: 'Dominican Peso',
    DZD: 'Algerian Dinar',
    EGP: 'Egyptian Pound',
    ERN: 'Eritrean Nakfa',
    ETB: 'Ethiopian Birr',
    EUR: 'Euro',
    FJD: 'Fijian Dollar',
    FKP: 'Falkland Islands Pound',
    GBP: 'British Pound Sterling',
    GEL: 'Georgian Lari',
    GHS: 'Ghanaian Cedi',
    GIP: 'Gibraltar Pound',
    GMD: 'Gambian Dalasi',
    GNF: 'Guinean Franc',
    GTQ: 'Guatemalan Quetzal',
    GYD: 'Guyanaese Dollar',
    HKD: 'Hong Kong Dollar',
    HNL: 'Honduran Lempira',
    HRK: 'Croatian Kuna',
    HTG: 'Haitian Gourde',
    HUF: 'Hungarian Forint',
    IDR: 'Indonesian Rupiah',
    ILS: 'Israeli New Shekel',
    INR: 'Indian Rupee',
    IQD: 'Iraqi Dinar',
    IRR: 'Iranian Rial',
    ISK: 'Icelandic Króna',
    JMD: 'Jamaican Dollar',
    JOD: 'Jordanian Dinar',
    JPY: 'Japanese Yen',
    KES: 'Kenyan Shilling',
    KGS: 'Kyrgystani Som',
    KHR: 'Cambodian Riel',
    KMF: 'Comorian Franc',
    KPW: 'North Korean Won',
    KRW: 'South Korean Won',
    KWD: 'Kuwaiti Dinar',
    KYD: 'Cayman Islands Dollar',
    KZT: 'Kazakhstani Tenge',
    LAK: 'Laotian Kip',
    LBP: 'Lebanese Pound',
    LKR: 'Sri Lankan Rupee',
    LRD: 'Liberian Dollar',
    LSL: 'Lesotho Loti',
    LVL: 'Latvian Lats',
    LYD: 'Libyan Dinar',
    MAD: 'Moroccan Dirham',
    MDL: 'Moldovan Leu',
    MGA: 'Malagasy Ariary',
    MKD: 'Macedonian Denar',
    MMK: 'Myanmar Kyat',
    MNT: 'Mongolian Tugrik',
    MOP: 'Macanese Pataca',
    MRO: 'Mauritanian Ouguiya',
    MUR: 'Mauritian Rupee',
    MVR: 'Maldivian Rufiyaa',
    MWK: 'Malawian Kwacha',
    MXN: 'Mexican Peso',
    MYR: 'Malaysian Ringgit',
    MZN: 'Mozambican Metical',
    NAD: 'Namibian Dollar',
    NGN: 'Nigerian Naira',
    NIO: 'Nicaraguan Córdoba',
    NOK: 'Norwegian Krone',
    NPR: 'Nepalese Rupee',
    NZD: 'New Zealand Dollar',
    OMR: 'Omani Rial',
    PAB: 'Panamanian Balboa',
    PEN: 'Peruvian Sol',
    PGK: 'Papua New Guinean Kina',
    PHP: 'Philippine Peso',
    PKR: 'Pakistani Rupee',
    PLN: 'Polish Złoty',
    PYG: 'Paraguayan Guarani',
    QAR: 'Qatari Riyal',
    RON: 'Romanian Leu',
    RSD: 'Serbian Dinar',
    RUB: 'Russian Ruble',
    RWF: 'Rwandan Franc',
    SAR: 'Saudi Riyal',
    SBD: 'Solomon Islands Dollar',
    SCR: 'Seychellois Rupee',
    SDG: 'Sudanese Pound',
    SEK: 'Swedish Krona',
    SGD: 'Singapore Dollar',
    SHP: 'Saint Helena Pound',
    SLL: 'Sierra Leonean Leone',
    SOS: 'Somali Shilling',
    SRD: 'Surinamese Dollar',
    STD: 'São Tomé & Príncipe Dobra',
    SYP: 'Syrian Pound',
    SZL: 'Swazi Lilangeni',
    THB: 'Thai Baht',
    TJS: 'Tajikistani Somoni',
    TMT: 'Turkmenistani Manat',
    TND: 'Tunisian Dinar',
    TOP: 'Tongan Paʻanga',
    TRY: 'Turkish Lira',
    TTD: 'Trinidad & Tobago Dollar',
    TWD: 'New Taiwan Dollar',
    TZS: 'Tanzanian Shilling',
    UAH: 'Ukrainian Hryvnia',
    UGX: 'Ugandan Shilling',
    USD: 'US Dollar',
    UYU: 'Uruguayan Peso',
    UZS: 'Uzbekistani Som',
    VEF: 'Venezuelan Bolívar',
    VND: 'Vietnamese Đồng',
    VUV: 'Vanuatu Vatu',
    WST: 'Samoan Tala',
    XAF: 'Central African CFA Franc',
    XCD: 'East Caribbean Dollar',
    XDR: 'Special Drawing Rights',
    XOF: 'West African CFA Franc',
    XPF: 'CFP Franc',
    YER: 'Yemeni Rial',
    ZAR: 'South African Rand',
    ZMW: 'Zambian Kwacha'
  };

  var CURRENCY_CODES = Object.keys(CURRENCY_NAMES);
  var inMemoryCache = {};
  var inflightByBase = {};

  function getElement(id) {
    return document.getElementById(id);
  }

  function populateSelectOptions(selectElement, selectedCode) {
    if (!selectElement) {
      return;
    }

    var fragment = document.createDocumentFragment();
    for (var i = 0; i < CURRENCY_CODES.length; i += 1) {
      var code = CURRENCY_CODES[i];
      var name = CURRENCY_NAMES[code];
      var option = document.createElement('option');
      option.value = code;
      option.textContent = name ? code + ' — ' + name : code;
      if (code === selectedCode) {
        option.selected = true;
      }
      fragment.appendChild(option);
    }

    selectElement.textContent = '';
    selectElement.appendChild(fragment);
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

  function getCachedEntry(baseCurrency) {
    var now = Date.now();
    var memoryEntry = inMemoryCache[baseCurrency];
    if (memoryEntry && now - memoryEntry.timestamp < CACHE_TTL_MS) {
      return memoryEntry;
    }

    var storedCache = readStoredCache();
    var storedEntry = storedCache[baseCurrency];
    if (storedEntry && now - storedEntry.timestamp < CACHE_TTL_MS) {
      inMemoryCache[baseCurrency] = storedEntry;
      return storedEntry;
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
    return cacheEntry;
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

    data.rates[baseCurrency] = 1;
    return data.rates;
  }

  async function getRatesEntry(baseCurrency, forceRefresh) {
    if (!forceRefresh) {
      var cachedEntry = getCachedEntry(baseCurrency);
      if (cachedEntry) {
        return cachedEntry;
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

        return cacheRates(baseCurrency, rates);
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

  function formatRateNumber(rateValue) {
    if (!Number.isFinite(rateValue)) {
      return '—';
    }
    var digits = rateValue < 0.1 ? 6 : rateValue < 10 ? 4 : 2;
    return new Intl.NumberFormat(undefined, {
      minimumFractionDigits: digits,
      maximumFractionDigits: digits
    }).format(rateValue);
  }

  function setButtonLoading(buttonElement, isLoading) {
    if (!buttonElement) {
      return;
    }

    var labelSpan = buttonElement.querySelector('.btn-label');
    var target = labelSpan || buttonElement;

    if (isLoading) {
      buttonElement.disabled = true;
      buttonElement.dataset.originalText = target.textContent;
      target.textContent = 'Syncing Rates…';
      return;
    }

    buttonElement.disabled = false;
    target.textContent = buttonElement.dataset.originalText || 'Convert Now';
  }

  function setStatusState(statusElement, stateDot, message, stateType) {
    if (statusElement) {
      statusElement.textContent = message || '';
      statusElement.dataset.state = stateType || 'idle';
    }
    if (stateDot) {
      stateDot.dataset.state = stateType || 'idle';
    }
  }

  function updateRateBreakdown(fromCode, toCode, rate, timestamp) {
    var unitRateEl = getElement('unit-rate');
    var inverseRateEl = getElement('inverse-rate');
    var updatedEl = getElement('rate-updated');
    var resultCodeEl = getElement('result-currency-badge');

    if (resultCodeEl) {
      resultCodeEl.textContent = toCode;
    }

    if (unitRateEl) {
      unitRateEl.textContent = '1 ' + fromCode + ' = ' + formatRateNumber(rate) + ' ' + toCode;
    }

    if (inverseRateEl) {
      var inverse = rate > 0 ? 1 / rate : 0;
      inverseRateEl.textContent = '1 ' + toCode + ' = ' + formatRateNumber(inverse) + ' ' + fromCode;
    }

    if (updatedEl && timestamp) {
      var timeStr = new Date(timestamp).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
      });
      updatedEl.textContent = 'Cached ' + timeStr;
    }
  }

  function renderCrossRates(baseCurrency, activeTarget, rates) {
    var container = getElement('cross-rates-body');
    var baseLabel = getElement('cross-base-code');
    if (baseLabel) {
      baseLabel.textContent = baseCurrency;
    }
    if (!container || !rates) {
      return;
    }

    var fragment = document.createDocumentFragment();
    for (var i = 0; i < BENCHMARK_CODES.length; i += 1) {
      var code = BENCHMARK_CODES[i];
      if (code === baseCurrency || typeof rates[code] !== 'number') {
        continue;
      }

      var row = document.createElement('button');
      row.type = 'button';
      row.className = 'cross-rate-item' + (code === activeTarget ? ' is-active' : '');
      row.dataset.targetCode = code;
      row.setAttribute('aria-label', 'Convert ' + baseCurrency + ' to ' + code);

      var pairSpan = document.createElement('span');
      pairSpan.className = 'cross-pair';
      var codeStrong = document.createElement('strong');
      codeStrong.textContent = code;
      var nameSmall = document.createElement('small');
      nameSmall.textContent = CURRENCY_NAMES[code] || '';
      pairSpan.appendChild(codeStrong);
      pairSpan.appendChild(nameSmall);

      var valueSpan = document.createElement('span');
      valueSpan.className = 'cross-value';
      valueSpan.textContent = formatRateNumber(rates[code]);

      row.appendChild(pairSpan);
      row.appendChild(valueSpan);
      fragment.appendChild(row);
    }

    container.textContent = '';
    container.appendChild(fragment);
  }

  function syncActivePills(amountValue, fromCode, toCode) {
    var amountButtons = document.querySelectorAll('[data-amount]');
    for (var i = 0; i < amountButtons.length; i += 1) {
      var btn = amountButtons[i];
      var isMatch = Number(btn.dataset.amount) === amountValue;
      btn.classList.toggle('is-active', isMatch);
      btn.setAttribute('aria-pressed', isMatch ? 'true' : 'false');
    }

    var pairButtons = document.querySelectorAll('[data-pair]');
    var currentPair = fromCode + '-' + toCode;
    for (var j = 0; j < pairButtons.length; j += 1) {
      var pairBtn = pairButtons[j];
      var isPairMatch = pairBtn.dataset.pair === currentPair;
      pairBtn.classList.toggle('is-active', isPairMatch);
      pairBtn.setAttribute('aria-pressed', isPairMatch ? 'true' : 'false');
    }
  }

  async function convertCurrency(forceRefresh) {
    var fromElement = getElement('from');
    var toElement = getElement('to');
    var amountElement = getElement('amount');
    var resultElement = getElement('result');
    var statusElement = getElement('status-message');
    var stateDot = getElement('status-dot');
    var buttonElement = getElement('convert-btn');

    if (!fromElement || !toElement || !amountElement || !resultElement) {
      return;
    }

    var fromCurrency = fromElement.value;
    var toCurrency = toElement.value;
    var amount = parseAmount(amountElement.value);

    syncActivePills(amount, fromCurrency, toCurrency);

    if (amount === null) {
      resultElement.value = '';
      setStatusState(statusElement, stateDot, 'Enter a valid amount (0 or more).', 'error');
      return;
    }

    if (fromCurrency === toCurrency) {
      resultElement.value = formatAmount(amount, toCurrency);
      updateRateBreakdown(fromCurrency, toCurrency, 1, Date.now());
      setStatusState(statusElement, stateDot, 'Identical currency selected (1:1 parity).', 'ok');
      return;
    }

    setButtonLoading(buttonElement, true);
    setStatusState(statusElement, stateDot, 'Fetching live mid-market rate…', 'loading');

    try {
      var entry = await getRatesEntry(fromCurrency, !!forceRefresh);
      var rates = entry.rates;
      var rate = rates[toCurrency];

      if (typeof rate !== 'number') {
        throw new Error('Missing rate for selected currency pair');
      }

      var convertedAmount = amount * rate;
      resultElement.value = formatAmount(convertedAmount, toCurrency);
      updateRateBreakdown(fromCurrency, toCurrency, rate, entry.timestamp);
      renderCrossRates(fromCurrency, toCurrency, rates);
      setStatusState(statusElement, stateDot, 'Live mid-market rate active.', 'ok');
    } catch (error) {
      resultElement.value = '';
      setStatusState(statusElement, stateDot, 'Unable to reach rate feed. Check connection and retry.', 'error');
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
      navigator.serviceWorker.register('./sw.js').catch(function () {
        // Avoid blocking app functionality when SW registration fails.
      });
    });
  }

  function setupEventHandlers() {
    var formElement = getElement('converter-form');
    var amountElement = getElement('amount');
    var fromElement = getElement('from');
    var toElement = getElement('to');
    var buttonElement = getElement('convert-btn');
    var swapButton = getElement('swap-btn');
    var crossRatesBody = getElement('cross-rates-body');

    if (!amountElement || !fromElement || !toElement || !buttonElement) {
      return;
    }

    populateSelectOptions(fromElement, fromElement.value || DEFAULT_FROM);
    populateSelectOptions(toElement, toElement.value || DEFAULT_TO);

    var debouncedConvert = debounce(function () {
      convertCurrency(false);
    }, 250);

    if (formElement) {
      formElement.addEventListener('submit', function (event) {
        event.preventDefault();
        convertCurrency(true);
      });
    }

    buttonElement.addEventListener('click', function (event) {
      if (formElement && buttonElement.type === 'submit') {
        return;
      }
      event.preventDefault();
      convertCurrency(false);
    });

    amountElement.addEventListener('input', debouncedConvert);
    fromElement.addEventListener('change', function () {
      convertCurrency(false);
    });
    toElement.addEventListener('change', function () {
      convertCurrency(false);
    });

    if (swapButton) {
      swapButton.addEventListener('click', function () {
        var currentFrom = fromElement.value;
        fromElement.value = toElement.value;
        toElement.value = currentFrom;
        swapButton.classList.remove('is-spinning');
        void swapButton.offsetWidth;
        swapButton.classList.add('is-spinning');
        convertCurrency(false);
      });
    }

    var amountPresets = document.querySelectorAll('[data-amount]');
    for (var i = 0; i < amountPresets.length; i += 1) {
      amountPresets[i].addEventListener('click', function (event) {
        var preset = event.currentTarget.dataset.amount;
        if (preset) {
          amountElement.value = preset;
          convertCurrency(false);
        }
      });
    }

    var pairShortcuts = document.querySelectorAll('[data-pair]');
    for (var j = 0; j < pairShortcuts.length; j += 1) {
      pairShortcuts[j].addEventListener('click', function (event) {
        var pair = (event.currentTarget.dataset.pair || '').split('-');
        if (pair.length === 2) {
          fromElement.value = pair[0];
          toElement.value = pair[1];
          convertCurrency(false);
        }
      });
    }

    if (crossRatesBody) {
      crossRatesBody.addEventListener('click', function (event) {
        var button = event.target.closest('[data-target-code]');
        if (button && button.dataset.targetCode) {
          toElement.value = button.dataset.targetCode;
          convertCurrency(false);
        }
      });
    }
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
