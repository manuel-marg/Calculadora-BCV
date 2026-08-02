document.addEventListener('DOMContentLoaded', async () => {
    const dateInput = document.getElementById('date');
    const currencySelect = document.getElementById('currency');
    const swapBtn = document.getElementById('swapBtn');
    const amountFrom = document.getElementById('amountFrom');
    const amountTo = document.getElementById('amountTo');
    const currencyFromDynamic = document.getElementById('currencyFromDynamic');
    const currencyToDynamic = document.getElementById('currencyToDynamic');
    const rateLabel = document.getElementById('rateLabel');

    let ratesData = {};
    let isReverse = false;
    let currentRate = null;

    dateInput.valueAsDate = new Date();

    async function loadRates() {
        try {
            const response = await fetch('data/rates.json');
            if (!response.ok) throw new Error('No se pudo cargar rates.json');
            ratesData = await response.json();
        } catch (error) {
            console.error('Error cargando tasas:', error);
            rateLabel.textContent = 'Error al cargar las tasas';
            rateLabel.classList.add('error');
        }
    }

    function formatDate(date) {
        return date.toISOString().split('T')[0];
    }

    function findClosestRate(selectedDate) {
        const dates = Object.keys(ratesData).sort();
        if (dates.length === 0) return null;

        if (ratesData[selectedDate]) {
            return { date: selectedDate, rate: ratesData[selectedDate] };
        }

        const selected = new Date(selectedDate);
        let closestDate = dates[0];
        let minDiff = Math.abs(new Date(dates[0]) - selected);

        for (const date of dates) {
            const diff = Math.abs(new Date(date) - selected);
            if (diff < minDiff) {
                minDiff = diff;
                closestDate = date;
            }
        }

        if (closestDate !== selectedDate) {
            rateLabel.textContent = `Fecha no disponible. Usando tasa del ${closestDate}`;
            rateLabel.classList.add('warning');
        } else {
            rateLabel.classList.remove('warning');
        }

        return { date: closestDate, rate: ratesData[closestDate] };
    }

    function updateRateDisplay(rateData) {
        if (!rateData || !rateData.rate) {
            rateLabel.textContent = 'Tasa no disponible para esta fecha';
            rateLabel.classList.add('error');
            return;
        }

        const rate = rateData.rate[currencySelect.value];
        if (rate) {
            currentRate = rate;
            rateLabel.textContent = `Tasa del día seleccionado: ${rate.toFixed(2)} VES`;
            rateLabel.classList.remove('error', 'warning');
            calculate();
        } else {
            rateLabel.textContent = 'Tasa no disponible para esta moneda';
            rateLabel.classList.add('error');
        }
    }

    function calculate() {
        if (!currentRate) return;

        const fromValue = parseFloat(amountFrom.value) || 0;
        let result;

        if (isReverse) {
            result = fromValue / currentRate;
        } else {
            result = fromValue * currentRate;
        }

        amountTo.value = result.toFixed(2);
    }

    function swap() {
        isReverse = !isReverse;

        if (isReverse) {
            currencyFromLabel.textContent = currencySelect.value;
            currencyToLabel.textContent = 'VES';
            amountFrom.placeholder = '0.00';
            amountTo.placeholder = '0.00';
            amountFrom.removeAttribute('readonly');
            amountTo.setAttribute('readonly', true);
        } else {
            currencyFromLabel.textContent = currencySelect.value;
            currencyToLabel.textContent = 'VES';
            amountFrom.placeholder = '0.00';
            amountTo.placeholder = '0.00';
            amountFrom.removeAttribute('readonly');
            amountTo.setAttribute('readonly', true);
        }

        const temp = amountFrom.value;
        amountFrom.value = amountTo.value;
        amountTo.value = temp;

        calculate();
    }

    dateInput.addEventListener('change', () => {
        const selectedDate = dateInput.value;
        const rateData = findClosestRate(selectedDate);
        updateRateDisplay(rateData);
    });

    currencySelect.addEventListener('change', () => {
        const selectedDate = dateInput.value;
        const rateData = findClosestRate(selectedDate);
        updateRateDisplay(rateData);
    });

    swapBtn.addEventListener('click', swap);

    amountFrom.addEventListener('input', calculate);

    await loadRates();
    const initialDate = dateInput.value;
    const rateData = findClosestRate(initialDate);
    updateRateDisplay(rateData);
});