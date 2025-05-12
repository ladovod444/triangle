(function(global, factory)
{
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
        typeof define === 'function' && define.amd ? define(factory) :
            (global = global || self, global.LazyLoad = factory());
}(this, (function()
{
    'use strict';

    function _extends()
    {

        // console.log('START _extends');

        _extends = Object.assign || function(target)
        {
            for(var i = 1; i < arguments.length; i++)
            {
                var source = arguments[i];

                for(var key in source)
                {
                    if(Object.prototype.hasOwnProperty.call(source, key))
                    {
                        target[key] = source[key];
                    }
                }
            }

            return target;
        };

        // console.log('END _extends');
        // console.log('*');
        // console.log('*');
        // console.log('*');

        return _extends.apply(this, arguments);
    }

    var runningOnBrowser = typeof window !== "undefined";
    //var isRobot = runningOnBrowser && !("onscroll" in window) || typeof navigator !== "undefined" && /(gle|ing|ro)bot|crawl|spider/i.test(navigator.userAgent);
    var supportsIntersectionObserver = runningOnBrowser && "IntersectionObserver" in window;
    var supportsClassList = runningOnBrowser && "classList" in document.createElement("p");
    var isHiDpi = runningOnBrowser && window.devicePixelRatio > 1;

    var isRobot = false;


    var rules = [

        () => runningOnBrowser && !("onscroll" in window),

        () => typeof navigator !== "undefined" && /(gle|ing|ro|dex|ya)bot|crawl|spider/i.test(navigator.userAgent),

        //Phantomjs как правило, не имеет внутри себя браузерных плагинов
        () => typeof navigator !== "undefined" && navigator.plugins instanceof PluginArray === false,

        // Влияет на консоль (мобильный девайс не определяет)
        //() => typeof navigator.userAgentData !== "undefined" && navigator.userAgentData.mobile === false && navigator.plugins.length === 0,

        //PhantomJs 1.x прокидывает 2 свойства в глобальный объект, проверим их
        () => (window.callPhantom || window._phantom),
        //PhantomJs и многие другие боты не
        () => (!Function.prototype.bind),
        //Запуская код через nodejs, у window будет доступен Buffer
        () => window.Buffer !== undefined,
        //Запуская сайт через coachjs у window будет доступен emit
        () => window.emit !== undefined,
        //Запуская сайт через rhino - у window будет доступен spawn
        () => window.spawn !== undefined,
        //Не только селениум использует webdriver, но и другие боты
        () => window.webdriver !== undefined,
        //Проверяем chrome based dom automation - также инструмент ботов для работы с DOM
        () => window.domAutomation !== undefined || window.domAutomationController !== undefined,
        //Headless браузеры не имеют размера окна, проверим это
        //WARNING: эту проверку не пройдут IOS 8 и ниже, а также sailfish webview
        () => window.outerWidth === 0 && window.outerHeight === 0,
        //Множество ботов не заботится проставлении navigator.online и ходят по сайту в оффлайн режиме
        () => window.navigator.onLine === false
    ];

    //Проверяем правила
    for(let i = 0; i < rules.length; i++)
    {
        if(rules[i]() === true)
        {

            isRobot = true;
            break;
        }
    }

    // // console.log('isRobot');
    // console.log(isRobot);


    var defaultSettings = {
        elements_selector: ".lazy",
        container: isRobot || runningOnBrowser ? document : null,
        threshold: 300,
        thresholds: null,
        data_src: "src",
        data_srcset: "srcset",
        data_sizes: "sizes",
        data_bg: "bg",
        data_bg_hidpi: "bg-hidpi",
        data_bg_multi: "bg-multi",
        data_bg_multi_hidpi: "bg-multi-hidpi",
        data_poster: "poster",
        class_applied: "applied",
        class_loading: "loading",
        class_loaded: "loaded",
        class_error: "error",
        class_entered: "entered",
        class_exited: "exited",
        unobserve_completed: true,
        unobserve_entered: false,
        cancel_on_exit: true,
        callback_enter: null,
        callback_exit: null,
        callback_applied: null,
        callback_loading: null,
        callback_loaded: null,
        callback_error: null,
        callback_finish: null,
        callback_cancel: null,
        use_native: false
    };


    var getExtendedSettings = function getExtendedSettings(customSettings)
    {
        return _extends({}, defaultSettings, customSettings);
    };

    /* Creates instance and notifies it through the window element */
    var createInstance = function createInstance(classObj, options)
    {


        // console.log('STATR createInstance');

        var event;
        var eventString = "LazyLoad::Initialized";
        var instance = new classObj(options);

        try
        {

            // Works in modern browsers
            event = new CustomEvent(eventString, {
                detail: {
                    instance: instance
                }
            });

        } catch(err)
        {

            // Works in Internet Explorer (all versions)
            event = document.createEvent("CustomEvent");
            event.initCustomEvent(eventString, false, false, {
                instance: instance
            });
        }

        window.dispatchEvent(event);

        // console.log('END createInstance *****************************');
        // console.log('*');
        // console.log('*');
        // console.log('*');

    };


    /* Auto initialization of one or more instances of lazyload, depending on the
     options passed in (plain object or an array) */


    var autoInitialize = function autoInitialize(classObj, options)
    {

        if(!options)
        {
            return;
        }

        if(!options.length)
        {

            // Plain object
            createInstance(classObj, options);
        } else
        {

            // Array of objects
            for(var i = 0, optionsItem; optionsItem = options[i]; i += 1)
            {
                createInstance(classObj, optionsItem);
            }
        }
    };


    var statusLoading = "loading";
    var statusLoaded = "loaded";
    var statusApplied = "applied";
    var statusEntered = "entered";
    var statusError = "error";
    var statusNative = "native";

    var dataPrefix = "data-";
    var statusDataName = "ll-status";


    var getData = function getData(element, attribute)
    {

        // console.log('START getData');

        // console.log(element);

        // console.log('END getData **************************');
        // console.log('*');
        // console.log('*');
        // console.log('*');


        return element.getAttribute(dataPrefix + attribute);
    };


    var setData = function setData(element, attribute, value)
    {

        // console.log('START setData');
        // console.log(element);

        var attrName = dataPrefix + attribute;

        if(value === null)
        {
            element.removeAttribute(attrName);
            return;
        }

        if(value === 'error')
        {
            element.classList.add('border');
            element.classList.add('border-danger');
        }

        element.setAttribute(attrName, value);

        // console.log('END setData ******************');
        // console.log('*');
        // console.log('*');
        // console.log('*');

    };

    var getStatus = function getStatus(element)
    {

        return getData(element, statusDataName);
    };

    var setStatus = function setStatus(element, status)
    {

        return setData(element, statusDataName, status);
    };

    var resetStatus = function resetStatus(element)
    {

        return setStatus(element, null);
    };

    var hasEmptyStatus = function hasEmptyStatus(element)
    {

        return getStatus(element) === null;
    };

    var hasStatusLoading = function hasStatusLoading(element)
    {

        return getStatus(element) === statusLoading;
    };

    var hasStatusError = function hasStatusError(element)
    {

        return getStatus(element) === statusError;
    };

    var hasStatusNative = function hasStatusNative(element)
    {

        return getStatus(element) === statusNative;
    };

    var statusesAfterLoading = [statusLoading, statusLoaded, statusApplied, statusError];

    var hadStartedLoading = function hadStartedLoading(element)
    {

        return statusesAfterLoading.indexOf(getStatus(element)) >= 0;
    };


    var safeCallback = function safeCallback(callback, arg1, arg2, arg3)
    {

        // console.log('START safeCallback');


        if(!callback)
        {

            // console.log('START safeCallback 1 ***********************');
            // console.log('*');
            // console.log('*');
            // console.log('*');

            return;
        }

        if(arg3 !== undefined)
        {

            // console.log('START safeCallback 2 ***********************');
            // console.log('*');
            // console.log('*');
            // console.log('*');

            callback(arg1, arg2, arg3);
            return;
        }

        if(arg2 !== undefined)
        {

            // console.log('START safeCallback 3 ***********************');
            // console.log('*');
            // console.log('*');
            // console.log('*');

            callback(arg1, arg2);
            return;
        }

        // console.log('START safeCallback 1 ***********************');

        callback(arg1);
    };

    var addClass = function addClass(element, className)
    {

        // console.log('START addClass');
        // console.log(element);


        if(supportsClassList)
        {
            element.classList.add(className);
            return;
        }

        element.className += (element.className ? " " : "") + className;

        // console.log('END addClass');
        // console.log('*');
        // console.log('*');

    };

    var removeClass = function removeClass(element, className)
    {

        // console.log('START removeClass');

        if(supportsClassList)
        {
            element.classList.remove(className);
            return;
        }

        element.className = element.className.replace(new RegExp("(^|\\s+)" + className + "(\\s+|$)"), " ").replace(/^\s+/, "").replace(/\s+$/, "");

        // console.log('END removeClass');
        // console.log('*');
        // console.log('*');
    };

    var addTempImage = function addTempImage(element)
    {
        // console.log('START addTempImage');
        element.llTempImage = document.createElement("IMG");
    };

    var deleteTempImage = function deleteTempImage(element)
    {
        // console.log('START deleteTempImage');
        delete element.llTempImage;
    };

    var getTempImage = function getTempImage(element)
    {
        // console.log('START getTempImage');
        return element.llTempImage;
    };


    /*    var addTempScript = function addTempScript(element) {
     element.llTempScript = document.createElement("SCRIPT");
     };

     var deleteTempScript = function deleteTempScript(element) {
     delete element.llTempScript;
     };
     var getTempScript = function getTempScript(element) {
     return element.llTempScript;
     };*/


    var unobserve = function unobserve(element, instance)
    {

        // console.log('START unobserve');

        if(!instance)
        {
            return;
        }
        var observer = instance._observer;
        if(!observer)
        {
            return;
        }
        observer.unobserve(element);

        // console.log('END unobserve');
        // console.log('*');
        // console.log('*');
    };

    var resetObserver = function resetObserver(observer)
    {

        // console.log('START resetObserver');

        observer.disconnect();

        // console.log('END resetObserver');
        // console.log('*');
        // console.log('*');
    };

    var unobserveEntered = function unobserveEntered(element, settings, instance)
    {
        // console.log('START unobserveEntered');

        if(settings.unobserve_entered)
        {
            unobserve(element, instance);
        }

        // console.log('END unobserveEntered');
        // console.log('*');
        // console.log('*');
    };

    var updateLoadingCount = function updateLoadingCount(instance, delta)
    {
        // console.log('START updateLoadingCount');

        if(!instance)
        {
            return;
        }
        instance.loadingCount += delta;

        // console.log('END updateLoadingCount');
        // console.log('*');
        // console.log('*');
    };

    var decreaseToLoadCount = function decreaseToLoadCount(instance)
    {

        // console.log('START decreaseToLoadCount');

        if(!instance)
        {
            return;
        }
        instance.toLoadCount -= 1;

        // console.log('END decreaseToLoadCount');
        // console.log('*');
        // console.log('*');
    };

    var setToLoadCount = function setToLoadCount(instance, value)
    {

        // console.log('START decreaseToLoadCount');

        if(!instance)
        {
            return;
        }
        instance.toLoadCount = value;

        // console.log('END decreaseToLoadCount');
        // console.log('*');
        // console.log('*');
    };

    var isSomethingLoading = function isSomethingLoading(instance)
    {

        return instance.loadingCount > 0;
    };

    var haveElementsToLoad = function haveElementsToLoad(instance)
    {

        return instance.toLoadCount > 0;
    };


    var getSourceTags = function getSourceTags(parentTag)
    {

        // console.log('START getSourceTags');
        // console.log(parentTag);

        var sourceTags = [];

        for(var i = 0, childTag; childTag = parentTag.children[i]; i += 1)
        {
            if(childTag.tagName === "SOURCE")
            {
                sourceTags.push(childTag);
            }
        }

        // console.log('END getSourceTags');
        // console.log('*');
        // console.log('*');

        return sourceTags;
    };


    var setAttributeIfValue = function setAttributeIfValue(element, attrName, value)
    {

        // console.log('START setAttributeIfValue');
        // console.log(element);

        if(!value)
        {
            return;
        }

        element.setAttribute(attrName, value);

        // console.log('END setAttributeIfValue');
        // console.log('*');
        // console.log('*');
    };

    var resetAttribute = function resetAttribute(element, attrName)
    {

        element.removeAttribute(attrName);
    };

    var hasOriginalAttributes = function hasOriginalAttributes(element)
    {

        return !!element.llOriginalAttrs;
    };


    /** ИЗОБРАЖЕНИЯ */

    var saveOriginalImageAttributes = function saveOriginalImageAttributes(element)
    {


        if(hasOriginalAttributes(element))
        {
            return;
        }

        var originalAttributes = {};
        originalAttributes["src"] = element.getAttribute("src");
        originalAttributes["srcset"] = element.getAttribute("srcset");
        originalAttributes["sizes"] = element.getAttribute("sizes");
        element.llOriginalAttrs = originalAttributes;
    };

    var restoreOriginalImageAttributes = function restoreOriginalImageAttributes(element)
    {


        if(!hasOriginalAttributes(element))
        {
            return;
        }

        var originalAttributes = element.llOriginalAttrs;
        setAttributeIfValue(element, "src", originalAttributes["src"]);
        setAttributeIfValue(element, "srcset", originalAttributes["srcset"]);
        setAttributeIfValue(element, "sizes", originalAttributes["sizes"]);
    };

    var setImageAttributes = function setImageAttributes(element, settings)
    {

        setAttributeIfValue(element, "sizes", getData(element, settings.data_sizes));
        setAttributeIfValue(element, "srcset", getData(element, settings.data_srcset));
        setAttributeIfValue(element, "src", getData(element, settings.data_src));
    };

    var resetImageAttributes = function resetImageAttributes(element)
    {

        resetAttribute(element, "src");
        resetAttribute(element, "srcset");
        resetAttribute(element, "sizes");
    };

    var forEachPictureSource = function forEachPictureSource(element, fn)
    {


        var parent = element.parentNode;

        if(!parent || parent.tagName !== "PICTURE")
        {
            return;
        }

        var sourceTags = getSourceTags(parent);
        sourceTags.forEach(fn);
    };


    /** ВИДЕО */

    var forEachVideoSource = function forEachVideoSource(element, fn)
    {

        var sourceTags = getSourceTags(element);
        sourceTags.forEach(fn);
    };

    var setSourcesVideo = function setSourcesVideo(element, settings)
    {
        forEachVideoSource(element, function(sourceTag)
        {
            setAttributeIfValue(sourceTag, "src", getData(sourceTag, settings.data_src));
        });

        setAttributeIfValue(element, "poster", getData(element, settings.data_poster));
        setAttributeIfValue(element, "src", getData(element, settings.data_src));
        element.load();
    };


    /** IMG */

    var restoreOriginalAttributesImg = function restoreOriginalAttributesImg(element)
    {

        forEachPictureSource(element, function(sourceTag)
        {
            restoreOriginalImageAttributes(sourceTag);
        });
        restoreOriginalImageAttributes(element);
    };


    var setSourcesImg = function setSourcesImg(element, settings)
    {

        forEachPictureSource(element, function(sourceTag)
        {
            saveOriginalImageAttributes(sourceTag);
            setImageAttributes(sourceTag, settings);
        });
        saveOriginalImageAttributes(element);
        setImageAttributes(element, settings);
    };

    var resetSourcesImg = function resetSourcesImg(element)
    {


        forEachPictureSource(element, function(sourceTag)
        {
            resetImageAttributes(sourceTag);
        });
        resetImageAttributes(element);
    };


    /** IFRAME */

    var setSourcesIframe = function setSourcesIframe(element, settings)
    {
        setAttributeIfValue(element, "src", getData(element, settings.data_src));
    };


    var setSourcesFunctions = {
        IMG: setSourcesImg,
        IFRAME: setSourcesIframe,
        VIDEO: setSourcesVideo
    };


    var setBackground = function setBackground(element, settings, instance)
    {

        var bg1xValue = getData(element, settings.data_bg);
        var bgHiDpiValue = getData(element, settings.data_bg_hidpi);
        var bgDataValue = isHiDpi && bgHiDpiValue ? bgHiDpiValue : bg1xValue;
        if(!bgDataValue)
        {
            return;
        }
        element.style.backgroundImage = "url(\"".concat(bgDataValue, "\")");
        getTempImage(element).setAttribute("src", bgDataValue);
        manageLoading(element, settings, instance);


    }; // NOTE: THE TEMP IMAGE TRICK CANNOT BE DONE WITH data-multi-bg
    // BECAUSE INSIDE ITS VALUES MUST BE WRAPPED WITH URL() AND ONE OF THEM
    // COULD BE A GRADIENT BACKGROUND IMAGE

    var setMultiBackground = function setMultiBackground(element, settings, instance)
    {


        var bg1xValue = getData(element, settings.data_bg_multi);
        var bgHiDpiValue = getData(element, settings.data_bg_multi_hidpi);
        var bgDataValue = isHiDpi && bgHiDpiValue ? bgHiDpiValue : bg1xValue;

        if(!bgDataValue)
        {
            return;
        }

        element.style.backgroundImage = bgDataValue;
        manageApplied(element, settings, instance);
    };

    var setSources = function setSources(element, settings)
    {

        // console.log('STAR setSources');

        // console.log(element);

        var setSourcesFunction = setSourcesFunctions[element.tagName];

        if(!setSourcesFunction)
        {
            return;
        }

        setSourcesFunction(element, settings);

        // console.log('END setSources');
        // console.log('*');
        // console.log('*');
    };


    var manageApplied = function manageApplied(element, settings, instance)
    {

        // console.log('START manageApplied');

        addClass(element, settings.class_applied);
        setStatus(element, statusApplied);

        if(settings.unobserve_completed)
        {
            // console.log(settings.unobserve_completed);
            // Отменить наблюдение сейчас, потому что мы не можем сделать это при загрузке
            unobserve(element, settings);
        }

        // console.log('bind safeCallback');
        safeCallback(settings.callback_applied, element, instance);


        // console.log('END manageApplied');
        // console.log('*');
        // console.log('*');
    };


    let invokeScript = function scriptLoading(element)
    {


        // console.log('invokeScript '+element.tagName);

        // if (isRobot) {
        //     console.error('Только для пользователей');
        //     return;
        // }


        let elem = null;

        if(element.tagName === 'LINK')
        {
            elem = document.createElement('LINK');
            elem.setAttribute('href', element.dataset.href);

            // console.log(element.dataset.href);
        }

        if(element.tagName === 'SCRIPT')
        {
            elem = document.createElement('SCRIPT');

            if(typeof element.dataset.src === 'string')
            {
                elem.setAttribute('src', element.dataset.src);
            } else
            {
                /** Присваиваем скрипт из тега */
                elem.text = element.text;
            }
        }

        if(elem)
        {

            // console.error('Количество плагинов ' + navigator.plugins.length);
            // // console.error('cookieEnabled ' + navigator.cookieEnabled);
            // console.error('userAgentData mobile' + navigator.userAgentData.mobile);
            // console.error('userAgentData platform' + navigator.userAgentData.platform);

            // for (let i = 0; i < navigator.plugins.length; i++) {
            //
            //
            //
            //     let plg = navigator.plugins[i].name + ' < = >' +
            //     navigator.plugins[i].filename + ' < = >' +
            //      navigator.plugins[i].description + ' < = >' +
            //      navigator.plugins[i].version ?? "version undefened";
            //
            //     console.error(plg);
            //
            // }

            // console.error(navigator.plugins);
            // console.error(navigator.appCodeName);
            // console.error(navigator.appName);
            // console.error(navigator.connection);
            // console.error(/(gle|ing|ro|dex|ya)bot|crawl|spider|lighthouse/i.test(navigator.userAgent));


            /** переопределяем аттрибуты */


            if(element instanceof Element && typeof element.getAttributeNames == 'function')
            {
                element.getAttributeNames().forEach((function(e)
                {

                    if(e != 'data-src' && e != 'data-href' && e != 'class')
                    {

                        if(e == 'data-nonce')
                        {
                            elem.setAttribute('nonce', element.getAttribute(e));
                        } else
                        {
                            elem.setAttribute(e.toString(), element.getAttribute(e));
                        }
                    }
                }));
            }

            element.remove();

            if(typeof callback == "function")
            {
                elem.addEventListener('load', callback);
            }

            setTimeout(function()
            {
                document.head.appendChild(elem);
            }, 100);


        }

        // console.log('END invokeScript');
        // console.log(element);
        // console.log('*');
        // console.log('*');
        // console.log('*');
        // console.log('*');
        // console.log('*');
        // console.log('*');
        // console.log('*');
        // console.log('*');
        // console.log('*');
        // console.log('*');
        // console.log('*');
        // console.log('*');
        // console.log('*');
        // console.log('*');
        // console.log('*');
        // console.log('*');
        // console.log('*');
        // console.log('*');
        // console.log('*');
        // console.log('*');
        // console.log('*');
        // console.log('*');
        // console.log('*');
        // console.log('*');
        // console.log('*');
    }


    var manageLoading = function manageLoading(element, settings, instance)
    {

        // console.log('START manageLoading');
        // console.log(element);

        updateLoadingCount(instance, +1);
        addClass(element, settings.class_loading);
        setStatus(element, statusLoading);
        safeCallback(settings.callback_loading, element, instance);

        element.removeAttribute('data-' + settings.data_bg);
        element.removeAttribute('data-' + settings.data_bg_hidpi);
        element.removeAttribute('data-' + settings.data_src);

        // console.log('END manageLoading');

        // console.log('*');
        // console.log('*');
        // console.log('*');

    };

    var elementsWithLoadEvent = ["IMG", "IFRAME", "VIDEO"];
    var hasLoadEvent = function hasLoadEvent(element)
    {
        return elementsWithLoadEvent.indexOf(element.tagName) > -1;
    };

    var checkFinish = function checkFinish(settings, instance)
    {


        if(instance && !isSomethingLoading(instance) && !haveElementsToLoad(instance))
        {
            safeCallback(settings.callback_finish, instance);
        }
    };

    var addEventListener = function addEventListener(element, eventName, handler)
    {

        element.addEventListener(eventName, handler);
        element.llEvLisnrs[eventName] = handler;
    };

    var removeEventListener = function removeEventListener(element, eventName, handler)
    {

        element.removeEventListener(eventName, handler);
    };

    var hasEventListeners = function hasEventListeners(element)
    {

        return !!element.llEvLisnrs;
    };

    var addEventListeners = function addEventListeners(element, loadHandler, errorHandler)
    {


        if(!hasEventListeners(element))
        {
            element.llEvLisnrs = {};
        }
        var loadEventName = element.tagName === "VIDEO" ? "loadeddata" : "load";
        addEventListener(element, loadEventName, loadHandler);
        addEventListener(element, "error", errorHandler);
    };

    var removeEventListeners = function removeEventListeners(element)
    {

        if(!hasEventListeners(element))
        {
            return;
        }

        var eventListeners = element.llEvLisnrs;

        for(var eventName in eventListeners)
        {
            var handler = eventListeners[eventName];
            removeEventListener(element, eventName, handler);
        }

        delete element.llEvLisnrs;
    };

    var doneHandler = function doneHandler(element, settings, instance)
    {


        deleteTempImage(element);
        updateLoadingCount(instance, -1);
        decreaseToLoadCount(instance);
        removeClass(element, settings.class_loading);

        if(settings.unobserve_completed)
        {
            unobserve(element, instance);
        }
    };

    var loadHandler = function loadHandler(event, element, settings, instance)
    {


        var goingNative = hasStatusNative(element);
        doneHandler(element, settings, instance);
        addClass(element, settings.class_loaded);
        setStatus(element, statusLoaded);
        safeCallback(settings.callback_loaded, element, instance);
        if(!goingNative)
        {
            checkFinish(settings, instance);
        }
    };

    var errorHandler = function errorHandler(event, element, settings, instance)
    {

        var goingNative = hasStatusNative(element);
        doneHandler(element, settings, instance);
        addClass(element, settings.class_error);
        setStatus(element, statusError);
        safeCallback(settings.callback_error, element, instance);
        if(!goingNative)
        {
            checkFinish(settings, instance);
        }
    };

    var addOneShotEventListeners = function addOneShotEventListeners(element, settings, instance)
    {


        var elementToListenTo = getTempImage(element) || element;

        if(hasEventListeners(elementToListenTo))
        {
            // This happens when loading is retried twice
            return;
        }

        var _loadHandler = function _loadHandler(event)
        {
            loadHandler(event, element, settings, instance);
            removeEventListeners(elementToListenTo);
        };

        var _errorHandler = function _errorHandler(event)
        {
            errorHandler(event, element, settings, instance);
            removeEventListeners(elementToListenTo);
        };

        addEventListeners(elementToListenTo, _loadHandler, _errorHandler);
    };


    var loadBackground = function loadBackground(element, settings, instance)
    {

        addTempImage(element);
        addOneShotEventListeners(element, settings, instance);
        setBackground(element, settings, instance);
        setMultiBackground(element, settings, instance);
    };

    var loadRegular = function loadRegular(element, settings, instance)
    {

        // console.log('loadRegular');
        // console.log(element);

        addOneShotEventListeners(element, settings, instance);
        setSources(element, settings);
        manageLoading(element, settings, instance);
    };


    var load = function load(element, settings, instance)
    {


        // console.log('load');
        // console.log(element);

        if(hasLoadEvent(element))
        {


            loadRegular(element, settings, instance);
        } else
        {
            loadBackground(element, settings, instance);
        }
    };


    var loadNative = function loadNative(element, settings, instance)
    {

        // console.log('loadNative');

        addOneShotEventListeners(element, settings, instance);
        setSources(element, settings);
        setStatus(element, statusNative);
    };


    var cancelLoading = function cancelLoading(element, entry, settings, instance)
    {


        if(!settings.cancel_on_exit)
        {
            return;
        }
        if(!hasStatusLoading(element))
        {
            return;
        }
        if(element.tagName !== "IMG")
        {
            return;
        } // Работает только на изображениях

        removeEventListeners(element);
        resetSourcesImg(element);
        restoreOriginalAttributesImg(element);
        removeClass(element, settings.class_loading);
        updateLoadingCount(instance, -1);
        resetStatus(element);
        safeCallback(settings.callback_cancel, element, entry, instance);
    };


    var onEnter = function onEnter(element, entry, settings, instance)
    {

        // console.log('onEnter');
        // console.log(element);

        setStatus(element, statusEntered);
        addClass(element, settings.class_entered);
        removeClass(element, settings.class_exited);
        unobserveEntered(element, settings, instance);
        safeCallback(settings.callback_enter, element, entry, instance);
        if(hadStartedLoading(element))
        {
            return;
        } //Prevent loading it again

        load(element, settings, instance);
    };


    var onExit = function onExit(element, entry, settings, instance)
    {

        // console.log('START onExit');
        // console.log(element);


        if(hasEmptyStatus(element))
        {
            return;
        } //Игнорировать первый проход при посадке

        addClass(element, settings.class_exited);
        cancelLoading(element, entry, settings, instance);
        safeCallback(settings.callback_exit, element, entry, instance);

        // console.log('END onExit');
        // console.log('*');
        // console.log('*');
    };

    var tagsWithNativeLazy = ["IMG", "IFRAME", "SCRIPT"];


    var shouldUseNative = function shouldUseNative(settings)
    {

        return settings.use_native && "loading" in HTMLImageElement.prototype;
    };


    var loadAllNative = function loadAllNative(elements, settings, instance)
    {


        // console.log('loadAllNative');

        elements.forEach(function(element)
        {


            // console.log(elements);

            if(tagsWithNativeLazy.indexOf(element.tagName) === -1)
            {
                return;
            }

            element.setAttribute("loading", "lazy");

            loadNative(element, settings, instance);
        });


        setToLoadCount(instance, 0);


        // console.log('*************');

    };


    var isIntersecting = function isIntersecting(entry)
    {
        return entry.isIntersecting || entry.intersectionRatio > 0;
    };

    var getObserverSettings = function getObserverSettings(settings)
    {

        return {
            root: settings.container === document ? null : settings.container,
            rootMargin: settings.thresholds || settings.threshold + "px"
        };
    };

    var intersectionHandler = function intersectionHandler(entries, settings, instance)
    {

        entries.forEach(function(entry)
        {
            invokeScript(entry.target);
            return isIntersecting(entry) ? onEnter(entry.target, entry, settings, instance) : onExit(entry.target, entry, settings, instance);
        });

        /** Снимаем блокировку модальных кнопок */

        executeFunc(function activeDisableButton()
        {
            if(typeof bootstrap !== 'object')
            {
                return false;
            }

            document.querySelectorAll('[data-bs-toggle="modal"]').forEach(function(el)
            {
                el.classList.remove('disabled');
            });

            return true;
        });


    };

    var observeElements = function observeElements(observer, elements)
    {

        // console.log('observeElements');
        //elements.forEach(function (element) {
        // console.log(element);
        //});

        // console.log('*************');


        elements.forEach(function(element)
        {
            observer.observe(element);
        });
    };

    var updateObserver = function updateObserver(observer, elementsToObserve)
    {

        // console.log('START updateObserver');

        //elementsToObserve.forEach(function (element) {
        // console.log(element);
        // });

        // console.log('bind resetObserver');
        resetObserver(observer);


        // console.log('bind observeElements');
        observeElements(observer, elementsToObserve);


        // console.log('END updateObserver');
        // console.log('*');
        // console.log('*');
        // console.log('*');

    };

    var setObserver = function setObserver(settings, instance)
    {

        // console.log('START setObserver');

        if(!supportsIntersectionObserver || shouldUseNative(settings))
        {
            return;
        }

        instance._observer = new IntersectionObserver(function(entries)
        {


            // console.log('START IntersectionObserver');

            //entries.forEach(function (element) {
            // console.log(element.target);
            //});

            intersectionHandler(entries, settings, instance);

            // console.log('END IntersectionObserver');


        }, getObserverSettings(settings));


        // console.log('END setObserver ******************************');
        // console.log('*');
        // console.log('*');
        // console.log('*');

    };


    var toArray = function toArray(nodeSet)
    {
        return Array.prototype.slice.call(nodeSet);
    };


    var queryElements = function queryElements(settings)
    {

        return settings.container.querySelectorAll(settings.elements_selector);
    };


    var excludeManagedElements = function excludeManagedElements(elements)
    {

        return toArray(elements).filter(hasEmptyStatus);
    };


    var hasError = function hasError(element)
    {

        return hasStatusError(element);
    };


    var filterErrorElements = function filterErrorElements(elements)
    {

        return toArray(elements).filter(hasError);
    };

    var getElementsToLoad = function getElementsToLoad(elements, settings)
    {

        return excludeManagedElements(elements || queryElements(settings));
    };


    var retryLazyLoad = function retryLazyLoad(settings, instance)
    {

        var errorElements = filterErrorElements(queryElements(settings));

        errorElements.forEach(function(element)
        {
            removeClass(element, settings.class_error);
            resetStatus(element);
        });

        instance.update();
    };


    var setOnlineCheck = function setOnlineCheck(settings, instance)
    {

        if(!runningOnBrowser)
        {
            return;
        }

        window.addEventListener("online", function()
        {
            retryLazyLoad(settings, instance);
        });
    };


    var LazyLoad = function LazyLoad(customSettings, elements)
    {

        // console.log('START LazyLoad');
        // console.log(elements);

        var settings = getExtendedSettings(customSettings);

        this._settings = settings;
        this.loadingCount = 0;

        // console.log('bind setObserver');
        setObserver(settings, this);

        // console.log('bind setOnlineCheck');
        setOnlineCheck(settings, this);

        this.update(elements);


        // console.log('END LazyLoad **************************');
        // console.log('*');
        // console.log('*');
        // console.log('*');

    };

    LazyLoad.prototype = {

        update: function update(givenNodeset)
        {
            LazyLoad.prototype

            // console.log('START LazyLoad.prototype');

            var settings = this._settings;

            var elementsToLoad = getElementsToLoad(givenNodeset, settings);

            setToLoadCount(this, elementsToLoad.length);


            if(isRobot || !supportsIntersectionObserver)
            {


                this.loadAll(elementsToLoad);
                return;
            }

            if(shouldUseNative(settings))
            {


                loadAllNative(elementsToLoad, settings, this);
                return;
            }

            updateObserver(this._observer, elementsToLoad);


            // console.log('END LazyLoad.prototype *****************');
            // console.log('*');
            // console.log('*');
            // console.log('*');

        },

        destroy: function destroy()
        {


            // Observer
            if(this._observer)
            {
                this._observer.disconnect();
            } // Очистить пользовательские атрибуты элементов


            queryElements(this._settings).forEach(function(element)
            {
                delete element.llOriginalAttrs;
            }); //Удалить все внутренние реквизиты

            delete this._observer;
            delete this._settings;
            delete this.loadingCount;
            delete this.toLoadCount;
        },

        loadAll: function loadAll(elements)
        {

            var _this = this;

            var settings = this._settings;
            var elementsToLoad = getElementsToLoad(elements, settings);

            elementsToLoad.forEach(function(element)
            {

                // console.log(element);

                unobserve(element, _this);
                load(element, settings, _this);
            });
        }
    };

    LazyLoad.load = function(element, customSettings)
    {
        var settings = getExtendedSettings(customSettings);

        if(element.dataset.allStatus === settings.class_loaded)
        {
            return;
        }

        load(element, settings);
    };

    LazyLoad.resetStatus = function(element)
    {


        resetStatus(element);
    }; // Automatic instances creation if required (useful for async script loading)


    if(runningOnBrowser)
    {

        autoInitialize(LazyLoad, window.lazyLoadOptions);
    }

    return LazyLoad;

})));

function reloadLazy(element = null)
{
    const selector = element ? element.querySelectorAll('.lazy') : document.querySelectorAll('.lazy');

    selector.forEach(e => window.LazyLoad.load(e));
}

/** Функция выполняется повторно, пока не верне TRUE  */
function executeFunc(func, initialDelay = 100, multiplier = 2, limit = 10000)
{
    return new Promise((resolve, reject) =>
    {
        let delay = initialDelay;

        const run = () =>
        {
            const result = func();

            if(delay > limit)
            {
                console.error('Ошибка при выполнении функции');
                console.log(func);
                resolve(true);
                return;
            }

            if(result === true)
            {
                resolve(true);
                return;
            }

            setTimeout(run, delay);

            delay *= multiplier; // Увеличиваем задержку

        };

        run();
    });
}