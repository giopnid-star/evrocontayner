document.addEventListener('DOMContentLoaded', () => {
    const elems = {
        type: document.getElementById('pc-type'),
        size: document.getElementById('pc-size'),
        material: document.getElementById('pc-material'),
        qty: document.getElementById('pc-qty'),
        addonIns: document.getElementById('addon-insulation'),
        addonEl: document.getElementById('addon-electrical'),
        addonShelving: document.getElementById('addon-shelving'),
        resultEl: document.getElementById('pc-result'),
        calculateBtn: document.getElementById('pc-calculate'),
        kioskLengthSlider: document.getElementById('pc-kiosk-length'),
        kioskLengthInput: document.getElementById('pc-kiosk-length-input'),
        kioskLengthDisplay: document.getElementById('pc-kiosk-length-display'),
        kioskWidthSlider: document.getElementById('pc-kiosk-width'),
        kioskWidthInput: document.getElementById('pc-kiosk-width-input'),
        kioskWidthDisplay: document.getElementById('pc-kiosk-width-display'),
        sizeSelectBlock: document.getElementById('pc-size-select-block'),
        sizeKioskBlock: document.getElementById('pc-size-kiosk-block')
    };

    const prices = {
        container: { medium: 2200000, large: 3700000 },
        kiosk: { small: 240000, medium: 420000, large: 600000 },
        mobile: { small: 180000, medium: 300000, large: 480000 }
    };

    const materialMult = { steel: 1.0, composite: 1.15, wood: 0.9 };
    const addonPrices = { insulation: 5000, electrical: 7000, shelving: 2000 };
    const kioskPricePerSqm = 145000;

    function formatTenge(n) {
        return new Intl.NumberFormat('kk-KZ', { style: 'currency', currency: 'KZT', maximumFractionDigits: 0 }).format(n);
    }

    function syncKioskDimensions(source) {
        if (source === 'slider-length' || source === 'all') {
            const val = parseFloat(elems.kioskLengthSlider.value);
            elems.kioskLengthInput.value = val;
            elems.kioskLengthDisplay.textContent = val;
        }
        if (source === 'input-length' || source === 'all') {
            let val = parseFloat(elems.kioskLengthInput.value);
            val = Math.max(3, Math.min(13, val));
            elems.kioskLengthSlider.value = val;
            elems.kioskLengthInput.value = val;
            elems.kioskLengthDisplay.textContent = val;
        }
        if (source === 'slider-width' || source === 'all') {
            const val = parseFloat(elems.kioskWidthSlider.value);
            elems.kioskWidthInput.value = val;
            elems.kioskWidthDisplay.textContent = val;
        }
        if (source === 'input-width' || source === 'all') {
            let val = parseFloat(elems.kioskWidthInput.value);
            val = Math.max(2, Math.min(4, val));
            elems.kioskWidthSlider.value = val;
            elems.kioskWidthInput.value = val;
            elems.kioskWidthDisplay.textContent = val;
        }
    }

    function calculate() {
        const type = elems.type.value;
        const size = elems.size.value;
        const material = elems.material.value;
        const qty = Math.max(1, parseInt(elems.qty.value) || 1);

        let base = 0;

        if (type === 'kiosk') {
            const length = parseFloat(elems.kioskLengthSlider.value);
            const width = parseFloat(elems.kioskWidthSlider.value);
            const area = length * width;
            base = Math.round(area * kioskPricePerSqm);
        } else {
            base = (prices[type] && prices[type][size]) ? prices[type][size] : 0;
        }

        const materialFactor = materialMult[material] || 1;

        let addons = 0;
        if (elems.addonIns.checked) addons += addonPrices.insulation;
        if (elems.addonEl.checked) addons += addonPrices.electrical;
        if (elems.addonShelving.checked) addons += addonPrices.shelving;

        const perUnit = Math.round((base * materialFactor) + addons);
        const total = perUnit * qty;

        elems.resultEl.textContent = formatTenge(total);
    }

    function updateSizeBlocks() {
        if (elems.type.value === 'kiosk') {
            elems.sizeSelectBlock.style.display = 'none';
            elems.sizeKioskBlock.style.display = 'block';
        } else {
            elems.sizeSelectBlock.style.display = 'block';
            elems.sizeKioskBlock.style.display = 'none';
        }
    }

    // Кнопка расчёта
    elems.calculateBtn.addEventListener('click', calculate);

    // Автоматическое переключение блоков при смене типа
    elems.type.addEventListener('change', () => {
        updateSizeBlocks();
    });

    // Слайдеры и input для киоска
    elems.kioskLengthSlider.addEventListener('input', () => {
        syncKioskDimensions('slider-length');
    });
    
    elems.kioskLengthInput.addEventListener('input', () => {
        syncKioskDimensions('input-length');
    });
    
    elems.kioskWidthSlider.addEventListener('input', () => {
        syncKioskDimensions('slider-width');
    });
    
    elems.kioskWidthInput.addEventListener('input', () => {
        syncKioskDimensions('input-width');
    });

    // Инициализация
    syncKioskDimensions('all');
    updateSizeBlocks();
    calculate();
});
