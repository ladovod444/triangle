/*
 *  Copyright 2022.  Baks.dev <admin@baks.dev>
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *   limitations under the License.
 *
 */

if(typeof $locale === 'undefined')
{
    let html = document.querySelector('html');
    let lng = html.getAttribute('lang');
    $locale = lng ? lng : 'en';
}


niceLang = {
    'ru': {
        placeholder: 'Выберите из списка ...',
        search: 'Поиск...',
    },
    'en': {
        placeholder: 'Select an option ...',
        search: 'Search...',
    }
}

function triggerClick(el)
{
    var event = document.createEvent("MouseEvents");
    event.initEvent("click", true, false);
    el.dispatchEvent(event);
}

function triggerChange(el)
{
    var event = document.createEvent("HTMLEvents");
    event.initEvent("change", true, false);
    el.dispatchEvent(event);
}

function triggerFocusIn(el)
{
    var event = document.createEvent("FocusEvent");
    event.initEvent("focusin", true, false);
    el.dispatchEvent(event);
}

function triggerFocusOut(el)
{
    var event = document.createEvent("FocusEvent");
    event.initEvent("focusout", true, false);
    el.dispatchEvent(event);
}

function attr(el, key)
{
    return el.getAttribute(key);
}

function data(el, key)
{
    return el.getAttribute("data-" + key);
}

function hasClass(el, className)
{
    if(el)
    {
        return el.classList.contains(className);
    } else
    {
        return false;
    }
}

function addClass(el, className)
{
    if(el)
    {
        return el.classList.add(className);
    }
}

function removeClass(el, className)
{
    if(el)
    {
        return el.classList.remove(className);
    }
}

var defaultOptions = {
    data: null,
    searchable: true
};

function NiceSelect(element, options, reset = false)
{

    let isExistSelec = document.getElementById(element.id + '_select2');

    if(isExistSelec)
    {
        isExistSelec.remove();
    }

    this.el = element;
    this.config = Object.assign({}, defaultOptions, options || {});
    this.data = this.config.data;
    this.selectedOptions = [];

    if(this.el.tagName !== 'SELECT')
    {
        return;
    }

    if(this.el.options[0] !== undefined && !this.el.options[0].value)
    {
        this.placeholder = this.el.options[0].text
    } else
    {
        this.placeholder =
            attr(this.el, "placeholder") ||
            this.config.placeholder ||
            niceLang[$locale].placeholder;
    }

    this.dropdown = null;
    this.multiple = attr(this.el, "multiple");
    this.disabled = attr(this.el, "disabled");
    this.id = attr(this.el, "id") + '_select2';

    if(options === 'update')
    {
        this.update();
    } else
    {
        this.create();
    }

}

NiceSelect.prototype.create = function()
{
    this.el.style.setProperty("display", "none", "important")

    if(this.data)
    {
        this.processData(this.data);
    } else
    {
        this.extractData();
    }

    this.renderDropdown();
    this.bindEvent();
};

NiceSelect.prototype.processData = function(data)
{
    var options = [];
    data.forEach(item =>
    {
        options.push({
            data: item,
            attributes: {
                selected: false,
                disabled: false,
                optgroup: item.value == 'optgroup'
            }
        });
    });
    this.options = options;
};

NiceSelect.prototype.extractData = function()
{
    var options = this.el.querySelectorAll("option,optgroup");
    var data = [];
    var allOptions = [];
    var selectedOptions = [];

    options.forEach(item =>
    {

        //console.log(item);

        if(item.tagName == 'OPTGROUP')
        {
            var itemData = {
                text: item.label,
                value: 'optgroup'
            };
        } else
        {
            var itemData = {
                text: item.innerText,
                value: item.value,
            };

        }

        var attributes = {
            selected: item.getAttribute("selected") != null,
            disabled: item.getAttribute("disabled") != null,
            optgroup: item.tagName == 'OPTGROUP',
            filter: typeof item.dataset.filter != "undefined" ? item.dataset.filter : null
        };


        data.push(itemData);
        allOptions.push({data: itemData, attributes: attributes});
    });

    this.data = data;
    this.options = allOptions;
    this.options.forEach(function(item)
    {
        if(item.attributes.selected)
        {
            selectedOptions.push(item);
        }
    });

    this.selectedOptions = selectedOptions;
};

NiceSelect.prototype.renderDropdown = function()
{
    var classes = [
        "nice-select",
        attr(this.el, "class") || "",
        this.disabled ? "disabled" : "",
        this.multiple ? "has-multiple" : ""
    ];

    let seachPlaceholder = this.el.dataset.search != undefined ? this.el.dataset.search : niceLang[$locale].search;

    let searchHtml = "<div class='nice-select-search-box'><input type='text' class='nice-select-search' placeholder='" + seachPlaceholder + "'/></div>";

    var html = `<div id='${this.id ? this.id : ""}' class='${classes.join(" ")}' tabindex='${
        this.disabled ? null : 0
    }'>
  <span class='${this.multiple ? "multiple-options" : "current"}'></span>
  <div class='nice-select-dropdown'>
  ${this.config.searchable ? searchHtml : ""}
  <ul class='list'></ul>
  </div></div>
`;

    this.el.insertAdjacentHTML("afterend", html);

    this.dropdown = this.el.nextElementSibling;
    this._renderSelectedItems();
    this._renderItems();
};

NiceSelect.prototype._renderSelectedItems = function()
{
    if(this.multiple)
    {
        var selectedHtml = "";
        if(window.getComputedStyle(this.dropdown).width == 'auto' || this.selectedOptions.length < 2)
        {

            this.selectedOptions.forEach(function(item)
            {
                selectedHtml += `<span class='current'>${item.data.text}</span>`;
            });
            selectedHtml = selectedHtml == "" ? this.placeholder : selectedHtml;
        } else
        {
            selectedHtml = this.selectedOptions.length + ' selected';
        }

        this.dropdown.querySelector(".multiple-options").innerHTML = selectedHtml;
    } else
    {
        let html =
            this.selectedOptions.length > 0
                ? this.selectedOptions[0].data.text
                : this.placeholder;

        this.dropdown.querySelector(".current").innerHTML = html;
    }
};

NiceSelect.prototype._renderItems = function()
{
    var ul = this.dropdown.querySelector("ul");
    this.options.forEach(item =>
    {
        ul.appendChild(this._renderItem(item));
    });
};

NiceSelect.prototype._renderItem = function(option)
{
    var el = document.createElement("li");
    el.innerHTML = option.data.text;

    /** добавили фильтр мелки шрифтом */
    if(option.attributes.filter)
    {

        el.title = option.attributes.filter;

        var small = document.createElement("small");
        small.textContent = option.attributes.filter;
        small.classList.add('ms-1');
        small.classList.add('text-muted');
        /*small.style.fontSize = '9px';*/
        el.appendChild(small);
    }

    if(option.attributes.optgroup)
    {
        el.classList.add('optgroup');
    } else
    {

        el.setAttribute("data-value", option.data.value);

        el.classList.add('option');

        if(option.attributes.selected)
        {
            el.classList.add('selected');
        }

        if(option.attributes.disabled)
        {
            el.classList.add('disabled');
        }

        if(option.data.value == '')
        {
            el.classList.add('text-muted');
        }

        // var classList = [
        //     "option",
        //     option.attributes.selected ? "selected" : null,
        //     option.attributes.disabled ? "disabled" : null,
        // ];

        el.addEventListener("click", this._onItemClicked.bind(this, option));
        //el.classList.add(...classList);
    }

    option.element = el;
    return el;
};

NiceSelect.prototype.update = function()
{

    this.extractData();

    if(this.dropdown)
    {
        var open = hasClass(this.dropdown, "open");
        this.dropdown.parentNode.removeChild(this.dropdown);
        this.create();

        if(open)
        {
            triggerClick(this.dropdown);
        }
    }

};

NiceSelect.prototype.disable = function()
{
    if(!this.disabled)
    {
        this.disabled = true;
        addClass(this.dropdown, "disabled");
    }
};

NiceSelect.prototype.enable = function()
{
    if(this.disabled)
    {
        this.disabled = false;
        removeClass(this.dropdown, "disabled");
    }
};

NiceSelect.prototype.clear = function()
{
    this.selectedOptions = [];
    this._renderSelectedItems();
    this.updateSelectValue();
    triggerChange(this.el);
};

NiceSelect.prototype.destroy = function()
{
    if(this.dropdown)
    {
        this.dropdown.parentNode.removeChild(this.dropdown);
        this.el.style.display = "";
    }
};

NiceSelect.prototype.bindEvent = function()
{
    var $this = this;
    this.dropdown.addEventListener("click", this._onClicked.bind(this));
    this.dropdown.addEventListener("keydown", this._onKeyPressed.bind(this));
    this.dropdown.addEventListener("focusin", triggerFocusIn.bind(this, this.el));
    this.dropdown.addEventListener("focusout", triggerFocusOut.bind(this, this.el));
    window.addEventListener("click", this._onClickedOutside.bind(this));

    if(this.config.searchable)
    {
        this._bindSearchEvent();
    }
};

NiceSelect.prototype._bindSearchEvent = function()
{
    var searchBox = this.dropdown.querySelector(".nice-select-search");
    if(searchBox)
    {
        searchBox.addEventListener("click", function(e)
        {
            e.stopPropagation();
            return false;
        });
    }

    searchBox.addEventListener("input", this._onSearchChanged.bind(this));
};

NiceSelect.prototype._onClicked = function(e)
{
    if(this.multiple)
    {
        this.dropdown.classList.add("open");
    } else
    {
        this.dropdown.classList.toggle("open");
    }

    if(this.dropdown.classList.contains("open"))
    {
        var search = this.dropdown.querySelector(".nice-select-search");

        if(search)
        {
            search.value = "";
            search.focus();
        }

        this.dropdown.querySelectorAll(".focus").forEach(e =>
        {
            removeClass(e, "focus");
        });


        var t = this.dropdown.querySelector(".selected");
        var list = this.dropdown.querySelector('.nice-select-dropdown .list');


        if(t && list)
        {
            if(t.tagName === 'SMALL')
            {
                this.dropdown.querySelectorAll(".selected").forEach(e =>
                {
                    removeClass(e, "selected");
                });

                addClass(t.parentElement, "focus");
                addClass(t.parentElement, "selected");
            } else
            {
                addClass(t, "focus");
            }

            const targetPosition = t.offsetTop;
            const parentScrollTop = list.scrollTop;
            parent.scrollTop = targetPosition - parentScrollTop;
        }

        this.dropdown.querySelectorAll("ul li").forEach(function(item)
        {
            item.style.display = "";
        });

    } else
    {
        this.dropdown.focus();
    }
};

NiceSelect.prototype._onItemClicked = function(option, e)
{
    var optionEl = e.target;

    if(!hasClass(optionEl, "disabled"))
    {
        if(this.multiple)
        {
            if(hasClass(optionEl, "selected"))
            {
                removeClass(optionEl, "selected");
                this.selectedOptions.splice(this.selectedOptions.indexOf(option), 1);
                this.el.querySelector('option[value="' + optionEl.dataset.value + '"]').selected = false;
            } else
            {
                addClass(optionEl, "selected");
                this.selectedOptions.push(option);
            }
        } else
        {
            this.selectedOptions.forEach(function(item)
            {
                removeClass(item.element, "selected");
            });

            addClass(optionEl, "selected");
            this.selectedOptions = [option];
        }

        this._renderSelectedItems();
        this.updateSelectValue();
    }
};

NiceSelect.prototype.updateSelectValue = function()
{
    if(this.multiple)
    {
        var select = this.el;
        this.selectedOptions.forEach(function(item)
        {
            var el = select.querySelector('option[value="' + item.data.value + '"]');
            if(el)
            {
                el.setAttribute("selected", true);
            }
        });
    } else if(this.selectedOptions.length > 0)
    {
        this.el.value = this.selectedOptions[0].data.value;
    }

    triggerChange(this.el);
};

NiceSelect.prototype._onClickedOutside = function(e)
{
    if(!this.dropdown.contains(e.target))
    {
        this.dropdown.classList.remove("open");
    }
};

NiceSelect.prototype._onKeyPressed = function(e)
{
    // Keyboard events

    var focusedOption = this.dropdown.querySelector(".focus");

    var open = this.dropdown.classList.contains("open");

    // Space or Enter
    if(e.keyCode == 32 || e.keyCode == 13)
    {
        if(open)
        {
            triggerClick(focusedOption);
        } else
        {
            triggerClick(this.dropdown);
        }
    } else if(e.keyCode == 40)
    {
        // Down
        if(!open)
        {
            triggerClick(this.dropdown);
        } else
        {
            var next = this._findNext(focusedOption);
            if(next)
            {
                var t = this.dropdown.querySelector(".focus");
                removeClass(t, "focus");
                addClass(next, "focus");
            }
        }
        e.preventDefault();
    } else if(e.keyCode == 38)
    {
        // Up
        if(!open)
        {
            triggerClick(this.dropdown);
        } else
        {
            var prev = this._findPrev(focusedOption);
            if(prev)
            {
                var t = this.dropdown.querySelector(".focus");
                removeClass(t, "focus");
                addClass(prev, "focus");
            }
        }
        e.preventDefault();
    } else if(e.keyCode == 27 && open)
    {
        // Esc
        triggerClick(this.dropdown);
    }
    return false;
};

NiceSelect.prototype._findNext = function(el)
{
    if(el)
    {
        el = el.nextElementSibling;
    } else
    {
        el = this.dropdown.querySelector(".list .option");
    }

    while(el)
    {
        if(!hasClass(el, "disabled") && el.style.display != "none")
        {
            return el;
        }
        el = el.nextElementSibling;
    }

    return null;
};

NiceSelect.prototype._findPrev = function(el)
{
    if(el)
    {
        el = el.previousElementSibling;
    } else
    {
        el = this.dropdown.querySelector(".list .option:last-child");
    }

    while(el)
    {
        if(!hasClass(el, "disabled") && el.style.display != "none")
        {
            return el;
        }
        el = el.previousElementSibling;
    }

    return null;
};

NiceSelect.prototype._onSearchChanged = function(e)
{
    var open = this.dropdown.classList.contains("open");
    var text = e.target.value;
    text = text.toLowerCase();


    if(text == "")
    {
        this.options.forEach(function(item)
        {
            item.element.style.display = "";
        });
    } else if(open)
    {

        var matchReg = new RegExp(text);

        this.options.forEach(function(item)
        {

            var optionText = item.data.text.toLowerCase();
            var matched = matchReg.test(optionText);


            /** Проверяем в другой раскладке */
            if(!matched)
            {
                optionText = changeKeyboard(optionText);
                matched = matchReg.test(optionText);
            }

            /** Проверяем по фильтру */
            if(!matched && item.attributes.filter)
            {
                optionText = item.attributes.filter.toLowerCase();
                matched = matchReg.test(optionText);
            }

            /** Проверяем в другой раскладке */
            if(!matched)
            {
                optionText = changeKeyboard(optionText);
                matched = matchReg.test(optionText);
            }


            item.element.style.display = matched ? "" : "none";
        });
    }

    this.dropdown.querySelectorAll(".focus").forEach(function(item)
    {
        removeClass(item, "focus");
    });

    var firstEl = this._findNext(null);
    addClass(firstEl, "focus");
};


function changeKeyboard(text)
{

    var layoutMapping = {
        'a': 'ф',
        'b': 'и',
        'c': 'с',
        'd': 'в',
        'e': 'у',
        'f': 'а',
        'g': 'п',
        'h': 'р',
        'i': 'ш',
        'j': 'о',
        'k': 'л',
        'l': 'д',
        'm': 'ь',
        'n': 'т',
        'o': 'щ',
        'p': 'з',
        'q': 'й',
        'r': 'к',
        's': 'ы',
        't': 'е',
        'u': 'г',
        'v': 'м',
        'w': 'ц',
        'x': 'ч',
        'y': 'н',
        'z': 'я',
        '[': 'х',
        ']': 'ъ',
        ';': 'ж',
        '\'': 'э',
        ',': 'б',
        '.': 'ю',
    };


    var convertedValue = '';
    for(var i = 0; i < text.length; i++)
    {
        var char = text[i];
        if(layoutMapping[char])
        {
            convertedValue += layoutMapping[char];
        } else
        {
            convertedValue += char;
        }
    }

    if(text === convertedValue)
    {
        var swappedObj = {};
        for(var key in layoutMapping)
        {
            if(layoutMapping.hasOwnProperty(key))
            {
                swappedObj[layoutMapping[key]] = key;
            }
        }

        convertedValue = '';

        for(var i = 0; i < text.length; i++)
        {
            var char = text[i];
            if(swappedObj[char])
            {
                convertedValue += swappedObj[char];
            } else
            {
                convertedValue += char;
            }
        }
    }

    return convertedValue;
}


function bind(el, options)
{
    return new NiceSelect(el, options);
}

document.querySelectorAll('[data-select="select2"]').forEach(function(item)
{
    new NiceSelect(item, {searchable: true});
});