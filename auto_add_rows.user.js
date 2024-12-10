// ==UserScript==
// @name         Auto Add Rows and Fill Data (v1.4.3)
// @namespace    http://tampermonkey.net/
// @version      1.4.3
// @description  Automatically add rows and fill data in CLM with correct selectors
// @author       You
// @match        *://elekta--svmxc.vf.force.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Add a button to start automation
    function addAutomationButton() {
        const button = document.createElement('button');
        button.innerText = 'Add Rows & Fill (v1.4.3)';
        button.style.position = 'fixed';
        button.style.top = '10px';
        button.style.right = '10px';
        button.style.zIndex = '9999';
        button.style.padding = '10px 15px';
        button.style.backgroundColor = '#000';
        button.style.color = '#FFF';
        button.style.border = 'none';
        button.style.borderRadius = '5px';
        button.style.cursor = 'pointer';

        button.addEventListener('mouseover', () => button.style.backgroundColor = '#000');
        button.addEventListener('mouseout', () => button.style.backgroundColor = '#000');
        button.addEventListener('mousedown', () => button.style.backgroundColor = '#333');
        button.addEventListener('mouseup', () => button.style.backgroundColor = '#000');

        button.addEventListener('click', handleAutomation);
        document.body.appendChild(button);
    }

    // Main automation logic
    async function handleAutomation() {
        console.log('Starting automation...');

        const addRowButton = document.querySelector('#sfm-button-1099-btnEl');
        if (!addRowButton) {
            alert('The "Add Row" button was not found. Check the button ID or page structure.');
            return;
        }

        // Add rows with increased delay
        for (let i = 0; i < 3; i++) {
            console.log(`Adding row ${i + 1}`);
            addRowButton.click();
            await delay(1000);
        }

        // Additional delay to ensure rows are fully loaded
        await delay(2000);

        // Get user input
        const date = prompt('Enter the date (YYYY-MM-DD):', '2024-12-09');
        if (!date) return alert('Date is required.');

        const time1 = prompt('Enter Time 1 (HH:MM):', '15:00');
        const time2 = prompt('Enter Time 2 (HH:MM):', '16:00');
        const time3 = prompt('Enter Time 3 (HH:MM):', '17:00');
        const time4 = prompt('Enter Time 4 (HH:MM):', '18:00');
        if (!time1 || !time2 || !time3 || !time4) return alert('All times are required.');

        // Find the table and cells
        const rows = Array.from(document.querySelectorAll('tr')).filter(row => {
            return row.querySelector('select') !== null;
        });

        console.log('Found rows with selects:', rows.length);

        const hourTypes = ['Travel', 'Service', 'Travel'];
        const serviceType = 'On-Site Service';
        const times = [time1, time2, time3, time4];

        for (let i = 0; i < 3; i++) {
            const row = rows[i];
            if (!row) {
                console.error(`Row ${i} not found`);
                continue;
            }

            console.log(`Processing row ${i + 1}`);

            // Get all selects and inputs in the row
            const selects = row.querySelectorAll('select');
            const inputs = row.querySelectorAll('input[type="text"]');

            // Debug info
            console.log(`Row ${i + 1} elements:`, {
                selects: selects.length,
                inputs: inputs.length
            });

            if (selects.length >= 2) {
                // First select is Hour Type, second is Service Type
                await selectDropdownValue(selects[0], hourTypes[i]);
                await delay(500);
                await selectDropdownValue(selects[1], serviceType);
                await delay(500);
            }

            if (inputs.length >= 2) {
                // First input is Start Time, second is End Time
                await simulateInput(inputs[0], `${date} ${times[i]}`);
                await delay(500);
                await simulateInput(inputs[1], `${date} ${times[i + 1]}`);
                await delay(500);
            }
        }

        console.log('Automation completed');
        alert('Automation completed! Please verify the data.');
    }

    // Helper function to select a value in a dropdown
    async function selectDropdownValue(dropdown, value) {
        console.log('Selecting dropdown value:', { value });

        // Log all available options
        const options = Array.from(dropdown.options);
        console.log('Available options:', options.map(opt => opt.text));

        // Try to find the option
        const optionToSelect = options.find(option =>
            option.text.trim().toLowerCase() === value.trim().toLowerCase()
        );

        if (optionToSelect) {
            dropdown.value = optionToSelect.value;
            dropdown.dispatchEvent(new Event('change', { bubbles: true }));
            console.log('Selected option:', optionToSelect.text);

            // Additional events that might be needed
            dropdown.dispatchEvent(new Event('input', { bubbles: true }));
            dropdown.dispatchEvent(new Event('blur', { bubbles: true }));

            return true;
        } else {
            console.warn(`Option "${value}" not found. Available options:`,
                options.map(o => o.text.trim())
            );
            return false;
        }
    }

    // Helper function to simulate input
    async function simulateInput(input, value) {
        console.log('Simulating input:', { value });

        // Focus the input
        input.focus();
        input.dispatchEvent(new Event('focus', { bubbles: true }));

        // Set the value
        input.value = value;

        // Trigger all possible events
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.dispatchEvent(new Event('change', { bubbles: true }));
        input.dispatchEvent(new Event('blur', { bubbles: true }));

        // Additional custom event that might be needed
        input.dispatchEvent(new CustomEvent('input', {
            bubbles: true,
            detail: { value: value }
        }));
    }

    // Helper function to add a delay
    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Initialize
    window.addEventListener('load', addAutomationButton);
})();
