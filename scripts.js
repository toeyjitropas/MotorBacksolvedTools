document.addEventListener("DOMContentLoaded", function() {
    const inputTable = document.getElementById('inputTable').getElementsByTagName('tbody')[0];
    const addRowButton = document.getElementById('addRowButton');
    let uniqueIdCounter = 1;

    function getOptionsFromTariffData(field) {
        return [...new Set(baseTariffData.map(item => item[field]))];
    }
    
    function getCapacityOptionsByMotorCode(motorCodeGroup) {
        return [...new Set(baseTariffData.filter(item => item.Motor_code_group === motorCodeGroup && item.RATE_CRITERIA === 'CAPACITY').map(item => item.RATE_NAME))];
    }

    function getAllSiByMotorCode(motorCodeGroup,tariffType) {
        return [...new Set(baseTariffData.filter(item => item.Motor_code_group === motorCodeGroup && 
            item.RATE_CRITERIA === 'SUM INSURED' && 
            item.Tariff_type === tariffType).map(item => item.RATE_NAME))];
    }
    
function addNewRow() {
    const newRow = document.createElement('tr');
    
    const actionsTd = document.createElement('td');
    actionsTd.className = 'actions';
    const deleteButton = document.createElement('button');
    deleteButton.className = 'btn btn-danger btn-sm';
    deleteButton.innerHTML = '<i class="fas fa-trash-alt"></i>';
    deleteButton.onclick = () => newRow.remove();
    actionsTd.appendChild(deleteButton);
    newRow.appendChild(actionsTd);

    const today = new Date().toISOString().split('T')[0];
    const nextYear = new Date();
    nextYear.setFullYear(nextYear.getFullYear() + 1);
    const nextYearDate = nextYear.toISOString().split('T')[0];

    const fields = [
        { name: 'uniqueId', id: 'uniqueId_' + uniqueIdCounter, type: 'text', value: uniqueIdCounter++, readonly: true },
        { name: 'nameChassis', id: 'nameChassis_' + uniqueIdCounter, type: 'text' },
        { name: 'vehicleCode', id: 'vehicleCode_' + uniqueIdCounter, type: 'select', options: ['','110', '110E', '120', '120E', '210', '210E', '220', '220E', '230', '230E', '320', '320E', '327', '327E', '340', '340E', '347', '347E', '420', '420E', '520', '540', '610', '610E', '620', '620E', '630', '630E', '730', '730E', '801', '801E', '802', '802E', '803', '803E', '804', '804E', '805', '805E', 'E11', 'E12'] },
        { name: 'vehicleMake', id: 'vehicleMake_' + uniqueIdCounter, type: 'text' },
        { name: 'vehicleModel', id: 'vehicleModel_' + uniqueIdCounter, type: 'text' },
        { name: 'vehicleGroup', id: 'vehicleGroup_' + uniqueIdCounter, type: 'select', options: ['1','2','3','4','5'] },
        { name: 'seat', id: 'seat_' + uniqueIdCounter, type: 'number' },
        { name: 'vehicleCapacity', id: 'vehicleCapacity_' + uniqueIdCounter, type: 'select', options: [] }, // Initially empty
        { name: 'vehicleRegistrationYear', id: 'vehicleRegistrationYear_' + uniqueIdCounter, type: 'number' },
        { name: 'policyEffectiveDate', id: 'policyEffectiveDate_' + uniqueIdCounter, type: 'date', value: today },
        { name: 'policyExpiryDate', id: 'policyExpiryDate_' + uniqueIdCounter, type: 'date', value: nextYearDate },
        { name: 'namedUnnamed', id: 'namedUnnamed_' + uniqueIdCounter, type: 'select', options: ['Named', 'Unnamed'] },
        { name: 'driverBirthDate', id: 'driverBirthDate_' + uniqueIdCounter, type: 'date', disableCondition: 'namedUnnamed_' + uniqueIdCounter, disableValue: 'Unnamed' },
        { name: 'driverLevel', id: 'driverLevel_' + uniqueIdCounter, type: 'select', options: ['1','2','3','4','5']},
        { name: 'productCoverages', id: 'productCoverages_' + uniqueIdCounter, type: 'select', options: ['Comprehensive', 'FT', 'Third party only', '2+', '3+'] },
        { name: 'eqipment', id: 'eqipment_' + uniqueIdCounter, type: 'select', options: ['N', 'Y'] },
        { name: 'odSumInsured', id: 'odSumInsured_' + uniqueIdCounter, type: 'number' },
        { name: 'ftSumInsured', id: 'ftSumInsured_' + uniqueIdCounter, type: 'number' },
        { name: 'tpbiPerPerson', id: 'tpbiPerPerson_' + uniqueIdCounter, type: 'select', options: ['500000', '600000', '700000', '800000', '900000', '1000000', '1250000', '1500000', '2000000', '2500000', '3000000', 'Unlimited'] },
        { name: 'tpbiPerEvent', id: 'tpbiPerEvent_' + uniqueIdCounter, type: 'select', options: ['10000000', '20000000', 'Unlimited'] },
        { name: 'tppdPerEvent', id: 'tppdPerEvent_' + uniqueIdCounter, type: 'select', options: ['200000', '400000', '600000', '800000', '1000000', '1500000', '2000000', '2500000', '3000000', '3500000', '4000000', '4500000', '5000000', '6000000', '7000000', '8000000', '9000000', '10000000', 'Unlimited'] },
        { name: 'odDD', id: 'odDD_' + uniqueIdCounter, type: 'number' },
        { name: 'tpDD', id: 'tpDD_' + uniqueIdCounter, type: 'number' },
        { name: 'paForDriver', id: 'paForDriver_' + uniqueIdCounter, type: 'number' },
        { name: 'paForPassenger', id: 'paForPassenger_' + uniqueIdCounter, type: 'number' },
        { name: 'medicalExpense', id: 'medicalExpense_' + uniqueIdCounter, type: 'number' },
        { name: 'bailbond', id: 'bailbond_' + uniqueIdCounter, type: 'number' },
        { name: 'fleetDiscount', id: 'fleetDiscount_' + uniqueIdCounter, type: 'number' },
        { name: 'ncb', id: 'ncb_' + uniqueIdCounter, type: 'number' },
        { name: 'directDiscount', id: 'directDiscount_' + uniqueIdCounter, type: 'number' },
        { name: 'cctvDiscount', id: 'cctvDiscount_' + uniqueIdCounter, type: 'number' },
        { name: 'applicationDiscount', id: 'applicationDiscount_' + uniqueIdCounter, type: 'number' },
        { name: 'targetPremium', id: 'targetPremium_' + uniqueIdCounter, type: 'number'}
    ];

    fields.forEach(field => {
        const td = document.createElement('td');
        let input;
        if (field.type === 'select') {
            input = document.createElement('select');
            input.id = field.id;
            input.className = 'form-control'; // Add Bootstrap class
            field.options.forEach(option => {
                const opt = document.createElement('option');
                opt.value = option;
                opt.textContent = option;
                input.appendChild(opt);
            });
        } else {
            input = document.createElement('input');
            input.type = field.type;
            input.id = field.id;
            input.className = 'form-control'; // Add Bootstrap class
            if (field.readonly) input.readOnly = true;
            if (field.value !== undefined) input.value = field.value;
        }
        input.name = field.name;
        if (field.disableCondition) {
            const conditionField = document.getElementById(field.disableCondition);
            if (conditionField) {
                input.disabled = conditionField.value === field.disableValue;
                conditionField.addEventListener('change', (e) => {
                    input.disabled = e.target.value === field.disableValue;
                });
            }
        }
        input.oninput = calculateRow;
        td.appendChild(input);
        newRow.appendChild(td);
    });

    const resultFields = ['message','status','min_premium','max_premium','rate',
        'base', 'basic_premium', 'base_av5', 'pa_driv', 'pa_pasg', 'med', 'bb',
        'discount_fleet', 'discount_ncb', 'discount_direct', 'discount_cctv', 'discount_app',
        'net_premium', 'new_stamp', 'new_vat', 'new_gross_premium'
    ];

    resultFields.forEach(field => {
        const td = document.createElement('td');
        td.className = field;
        newRow.appendChild(td);
    });

    inputTable.appendChild(newRow);

    // Handle change of OIC Code and show the Capacity
    document.querySelectorAll('[id^="vehicleCode_"]').forEach((input) => {
        input.addEventListener('change', (e) => {
            const idParts = input.id.split('_');
            const rowId = idParts[1];
            const vehicleCapacitySelect = document.getElementById('vehicleCapacity_' + rowId);
            updateCapacityOptions(vehicleCapacitySelect, e.target.value);

            // Disable driverLevel if vehicleCode doesn't start with 'E'
            const driverLevel = document.getElementById('driverLevel_' + rowId);
            if (driverLevel) {
                driverLevel.disabled = !e.target.value.startsWith('E');
            }
        });
    });

    // Handle change of namedUnnamed and disable driverBirthDate
    document.querySelectorAll('[id^="namedUnnamed_"]').forEach((input) => {
        input.addEventListener('change', (e) => {
            const idParts = input.id.split('_');
            const rowId = idParts[1];
            const driverBirthDate = document.getElementById('driverBirthDate_' + rowId);
            if (driverBirthDate) {
                driverBirthDate.disabled = e.target.value === 'Unnamed';
            }
        });
    });

    // Initialize the disable logic for the newly created row
    const vehicleCodeInput = document.getElementById('vehicleCode_' + (uniqueIdCounter));
    if (vehicleCodeInput) {
        vehicleCodeInput.dispatchEvent(new Event('change'));    
    }

    const namedUnnamedInput = document.getElementById('namedUnnamed_' + (uniqueIdCounter));
    if (namedUnnamedInput) {
        namedUnnamedInput.dispatchEvent(new Event('change'));
    }
}

    // Function to update capacity options based on motor code
    function updateCapacityOptions(selectElement, motorCodeGroup) {
        const options = getCapacityOptionsByMotorCode(motorCodeGroup);
        selectElement.innerHTML = '';
        options.forEach(option => {
            const opt = document.createElement('option');
            opt.value = option;
            opt.textContent = option;
            selectElement.appendChild(opt);
        });
    }
    
            

    // Load the base tariff data
    // <script src="baseTariffData.js"></script> should be included in your HTML file

    function getRateBase(tariffType, motorCodeGroup, rateName, rateCriteria) {
        let arr = [...new Set(baseTariffData.filter(item => item.Motor_code_group === motorCodeGroup
            && item.RATE_CRITERIA === rateCriteria 
            && item.Tariff_type === tariffType
            && item.RATE_NAME === rateName))];
        // if arr error return 0
        if (arr.length === 0) {
            return 0;
        }
        return arr[0].RATE;
             // Default to 0 if no match is found
    }
    function getAdditionRate(motorCodeGroup, rateName, rateCriteria) {
        if (rateCriteria === 'RY03') {
            let arr = [...new Set(additionalRating.filter(item => item.Motor_code_group === motorCodeGroup
                && item.RATE_CRITERIA === rateCriteria ))];
            // if arr error return 0
            if (arr.length === 0) {
                return 0;
            }
            return arr[0].RATE;
        } else {
            let arr = [...new Set(additionalRating.filter(item => item.Motor_code_group === motorCodeGroup
                && item.RATE_CRITERIA === rateCriteria 
                && item.RATE_NAME === rateName))];
            // if arr error return 0
            if (arr.length === 0) {
                return 0;
            }
            return arr[0].RATE;

        }
    }

    function calculateRow(event) {
        const row = event.target.closest('tr');
        const inputs = row.querySelectorAll('input, select');
        let tariffType = () => {
            if (['Comprehensive'].includes(inputs[14].value)) {
                return 'Comprehensive'
            } else if (['2+','FT'].includes(inputs[14].value)) {
                return 'FT'
            } else if (['3+','Third party only'].includes(inputs[14].value)) {
                return 'Third Party'
            }
        }
        const values = {};
        let grouped_motor_code = () => {
            if (['110','110E','120','120E','E11','E12'].includes(inputs[2].value)) {
                return '110';
            } else if (['210','210E','220','220E','230','230E'].includes(inputs[2].value)) {
                return '210';
            } else if (['320','320E','327','327E','340','340E','347','347E'].includes(inputs[2].value)) {
                return '320';
            } else if (['420','420E'].includes(inputs[2].value)) {
                return '420';
            } else if (['520','540'].includes(inputs[2].value)) {
                return '520';
            } else if (['610','610E','620','620E','630','630E'].includes(inputs[2].value)) {
                return '610';
            } else if (['730','730E'].includes(inputs[2].value)) {
                return '730';
            } else if (['801','801E'].includes(inputs[2].value)) {
                return '801';
            } else if (['802','802E'].includes(inputs[2].value)) {
                return '802';
            } else if (['803','803E'].includes(inputs[2].value)) {
                return '803';
            } else if (['804','804E'].includes(inputs[2].value)) {
                return '804';
            } else if (['805','805E'].includes(inputs[2].value)) {
                return '805';
            }
        };

        // let base_rate = getRateBase(, row.querySelector('#vehicleCode_' + row.querySelector('#uniqueId_' + row.id).value).value, 'BASE', 'BASE');

        let min_base = getRateBase(tariffType(), inputs[2].value, 'BASE_MIN', 'BASE');
        let max_base = getRateBase(tariffType(), inputs[2].value, 'BASE_MAX', 'BASE');
        let f_driver = () => {
            if (inputs[11].value === 'Named' && !(['E11','E12'].includes(inputs[2].value))) {
                let ages = () => {
                    let age = new Date(inputs[12].value).getFullYear();
                    let current = new Date().getFullYear();
                    if (current - age < 25) {
                        return '18-24';
                    } else if (current - age < 36) {
                        return '25-35';
                    } else if (current - age < 51) {
                        return '36-50';
                    } else {
                        return 'gt 50';
                    }
                }
                return getRateBase(tariffType(), grouped_motor_code(), ages(), 'DRIVER_AGE');
            } else if (!(['E11','E12'].includes(inputs[2].value))){
                return getRateBase(tariffType(), grouped_motor_code(), 'Unnamed', 'DRIVER_AGE');
            } else {
                return getRateBase(tariffType(), inputs[2].value,inputs[12].value, 'DRIVER_AGE');
            }
        };
        let f_capacity = getRateBase(tariffType(), grouped_motor_code(), inputs[7].value, 'CAPACITY');
        let f_equipment = () => {
            if (['320','420','520'].includes(grouped_motor_code())) {
                return getRateBase(tariffType(), grouped_motor_code(), inputs[15].value, 'EQUIPMENT');
            } else {
                return 1;
            }
        };
        let f_tpbi_per_event = getRateBase(tariffType(),'',inputs[19].value,'TPBI PER EVENT');
        let f_tpbi_per_person = getRateBase(tariffType(),grouped_motor_code(),inputs[18].value,'TPBI PER PERSON');
        let f_tppd = getRateBase(tariffType(),grouped_motor_code(),inputs[20].value,'TPPD PER EVENT');
        let f_veh_group = () => {
            if (grouped_motor_code() === '110') {
                return getRateBase(tariffType(),'110',inputs[5].value,'OIC CAR GROUP')
            } else {
                return 1
            }
        }

        let f_veh_age = () => {
            // calcualte vehile age by using year of effective - year of vehicle registration year + 1
            const effdate = new Date(inputs[9].value);
            let vehage = effdate.getFullYear() - inputs[8].value + 1;
            if (vehage > 10) {
                return getRateBase(tariffType(),grouped_motor_code(),'gt 10','VEHICLE AGE')
            } else {
                return getRateBase(tariffType(),grouped_motor_code(),String(vehage),'VEHICLE AGE')
            }
        }

        let getSi = () => {
            // get all list of sum insured filter with tariff type, grouped_motor_code
            let allSi = getAllSiByMotorCode(grouped_motor_code(),tariffType());
            // convert allSi into number
            allSi = allSi.map(Number);
            allSi.sort((a, b) => a - b);

            // Find the closest upper bound
            for (let i = 0; i < allSi.length; i++) {
                if (allSi[i] >= Number(inputs[16].value)) {
                    return allSi[i];
                }
            }
        };

        let f_si = getRateBase(tariffType(),grouped_motor_code(),String(getSi()),'SUM INSURED');
        let od_dd = () => {
            if (inputs[21].value <= 5000) {
                return parseFloat(inputs[21].value);
            } else {
                return 5000 + (inputs[21].value - 5000) * 0.1;
            }
        }
        let tp_dd = () => {
            if (inputs[22].value <= 5000) {
                return inputs[22].value * 0.1;
            } else {
                return 500 + (inputs[22].value - 5000) * 0.01;
            }
        }

        let av5Base = () => {
            if (!(['2+','3+'].includes(inputs[14].value))) {
                return 0;
            } else {
                return 1;
            }
        }
        
        // Example usage:
        const days = (new Date(inputs[10].value) - new Date(inputs[9].value)) / (1000 * 60 * 60 * 24);
        function getRateForDays(days) {
            const rateObj = dayRates.find(range => days >= range.min && days <= range.max);
            return rateObj ? rateObj.rate : null;
        }
        
        // Example usage:
        
        // console.log(inputs)

        values.rate = f_driver() * f_capacity * f_equipment() * f_tpbi_per_event * f_tpbi_per_person * f_tppd * f_veh_group() * f_veh_age() * f_si;
        values.targetPremium = parseFloat(inputs[32].value).toFixed(2);
        values.od_dd = parseFloat(od_dd());
        values.tp_dd = parseFloat(tp_dd());
        values.baseAv5 = parseFloat(av5Base());
        values.pa_driv_max_rate = parseFloat(getAdditionRate(inputs[2].value,'Driver','RY01') * inputs[23].value);
        values.pa_pasg_max_rate = parseFloat(getAdditionRate(inputs[2].value,'Passanger','RY01') * inputs[24].value * (inputs[6].value -1));
        values.bb_max_rate = parseFloat(getAdditionRate(inputs[2].value,'','RY03') * inputs[26].value);
        values.med_max_rate = parseFloat(getAdditionRate(inputs[2].value,String(inputs[25].value),'RY02') * inputs[6].value);
        values.pa_si = parseFloat(inputs[24].value);
        values.me_si = parseFloat(inputs[26].value);
        values.base_min = parseFloat(min_base);
        values.base_max = parseFloat(max_base);
        values.discount_fleet = inputs[27].value / 100;
        values.discount_ncb = inputs[28].value / 100;
        values.discount_direct = inputs[29].value / 100;
        values.discount_cctv = inputs[30].value / 100;
        values.discount_app = inputs[31].value / 100;
        values.coverage_day = parseFloat(getRateForDays(days));

        // console.log(values);

        const result = backSolve(
            values.targetPremium, values.rate, values.od_dd, values.tp_dd,
            values.baseAv5, values.pa_driv_max_rate, values.pa_pasg_max_rate,
            values.bb_max_rate, values.med_max_rate, values.pa_si, values.me_si,
            values.base_min, values.base_max, values.discount_fleet, values.discount_ncb,
            values.discount_cctv, values.discount_app, values.discount_direct, values.coverage_day
        );

        // Checking Rate
        // console.log({
        //     f_driver: f_driver(),
        //     f_capacity: f_capacity,
        //     f_equipment: f_equipment(),
        //     f_tpbi_per_event: f_tpbi_per_event,
        //     f_tpbi_per_person: f_tpbi_per_person,
        //     f_tppd: f_tppd,
        //     f_veh_group: f_veh_group(),
        //     f_veh_age: f_veh_age(),
        //     f_si: f_si,
        //     rate: values.rate}
        // );

        const resultFields = {
            message: result.message,
            status: result.status,
            min_premium: result.min_premium,
            max_premium: result.max_premium,
            rate: result.rate,
            base: result.base,
            basic_premium: result.basic_premium,
            base_av5: result.base_av5,
            pa_driv: result.pa_driv,
            pa_pasg: result.pa_pasg,
            med: result.med,
            bb: result.bb,
            discount_fleet: result.discount_fleet,
            discount_ncb: result.discount_ncb,
            discount_direct: result.discount_direct,
            discount_cctv: result.discount_cctv,
            discount_app: result.discount_app,
            net_premium: result.net_premium,
            new_stamp: result.new_stamp,
            new_vat: result.new_vat,
            new_gross_premium: result.new_gross_premium
        };

        for (let [key, value] of Object.entries(resultFields)) {
            row.querySelector(`.${key}`).textContent = value;
        }
    }

    addRowButton.addEventListener('click', addNewRow);

    function fw_rating_calculation(base, base_av5, deduct, fleet_dis, ncb_dis, cctv_dis, app_dis, direct_dis, coverage_day) {
        const prem1 = parseFloat(base + deduct);
        const fleet_discount = -parseFloat(Math.round(prem1 * fleet_dis, 0));
        const ncb_discount = -parseFloat(Math.round((prem1 + fleet_discount) * ncb_dis, 0));
        const direct_discount = -parseFloat(Math.round((prem1 + fleet_discount + ncb_discount + base_av5) * direct_dis, 0));
        const cctv_discount = -parseFloat(Math.round((prem1 + fleet_discount + ncb_discount + direct_discount + base_av5) * cctv_dis, 0));
        const app_discount = -parseFloat(Math.round((prem1 + fleet_discount + ncb_discount + direct_discount + cctv_discount + base_av5) * app_dis, 0));
        return [
            parseFloat(Math.round((prem1 + fleet_discount + ncb_discount + direct_discount + cctv_discount + app_discount + base_av5) * coverage_day, 2)).toFixed(2),
            fleet_discount, ncb_discount, direct_discount, cctv_discount, app_discount
        ];
    }

    function backSolve(targetPremium=0, rate, od_dd, tp_dd, baseAv5, pa_driv_max_rate, pa_pasg_max_rate, bb_max_rate, med_max_rate, pa_si, me_si, base_min, base_max, discount_fleet = 0, discount_ncb = 0, discount_cctv = 0, discount_app = 0, discount_direct = 0, coverage_day = 365) {
        const min_premium = fw_rating_calculation(parseFloat(Math.round(base_min * rate, 0)) + 4.0, baseAv5, od_dd + tp_dd, discount_fleet, discount_ncb, discount_cctv, discount_app, discount_direct, coverage_day)[0];
        const max_premium = fw_rating_calculation(parseFloat(Math.round(base_max * rate, 0)) + pa_driv_max_rate + pa_pasg_max_rate + med_max_rate + bb_max_rate, baseAv5, od_dd + tp_dd, discount_fleet, discount_ncb, discount_cctv, discount_app, discount_direct, coverage_day)[0];

        if (targetPremium < min_premium) {
            return {
                message: 'Target Premium is less than Minimum Premium',
                status: 'Failed',
                min_premium: min_premium,
                max_premium: max_premium,
                target_premium: targetPremium.toFixed(2)
            };
        } else if (targetPremium > max_premium) {
            return {
                message: 'Target Premium is more than Maximum Premium',
                status: 'Failed',
                min_premium: min_premium,
                max_premium: max_premium,
                target_premium: targetPremium.toFixed(2)
            };
        } else if (targetPremium === 0) {
            return {
                message: 'Target Premium is 0',
                status: 'Failed',
                min_premium: min_premium,
                max_premium: max_premium,
                target_premium: targetPremium.toFixed(2)
            }
        }

        let pa_driv_premium = pa_si * 0.000103222487317189;
        let pa_pasg_premium = pa_si * 0.0000495259408845098;
        let med_premium = me_si * 0.0000650958528842174;
        let bb_premium = 1;

        let base = Math.min(base_max, 
                        Math.max(base_min,
                            Math.round(
                                (
                                    (((targetPremium / (1 - discount_cctv) * (1 - discount_app) * (1 - discount_direct)) 
                                        - baseAv5) / ((1 - discount_fleet) * (1 - discount_ncb))) - od_dd - tp_dd - pa_driv_premium - pa_pasg_premium - med_premium - bb_premium) / rate, 2)));

        let basic_premium = Math.round(base * rate, 0) + pa_driv_premium + pa_pasg_premium + med_premium + bb_premium;
        let calcFw = fw_rating_calculation(basic_premium, baseAv5, od_dd + tp_dd, discount_fleet, discount_ncb, discount_cctv, discount_app, discount_direct, coverage_day);
        let diff = targetPremium - calcFw[0];

        let loopCounter = 1;
        while (diff !== 0) {
            if (loopCounter > 1000) {
                break;
            }
            // console.log({
            //     loopCounter: loopCounter,
            //     base: base,
            //     pa_driv_premium: pa_driv_premium,
            //     pa_pasg_premium: pa_pasg_premium,
            //     med_premium: med_premium,
            //     bb_premium: bb_premium,
            //     diff: diff,
            //     targetPremium: targetPremium,
            //     calcFw: calcFw,
            // })

            if (pa_driv_premium === pa_driv_max_rate) {
                if (pa_pasg_premium === pa_pasg_max_rate) {
                    if (med_premium === med_max_rate) {
                        if (bb_premium === bb_max_rate) {
                            if ((base > base_max) || (base < base_min)) {
                                return {
                                    message: 'Cannot Backsolved, No Base find',
                                    status: 'Failed',
                                    min_premium: min_premium,
                                    max_premium: max_premium,
                                    target_premium: targetPremium.toFixed(2)
                                };
                            } else {
                                base = Math.round(base + (diff / rate), 2);

                            }
                        } else {
                            bb_premium = Math.round(Math.min(bb_max_rate, Math.max(0, bb_premium + Math.round((diff / ((1 - discount_fleet) * (1 - discount_ncb) * (1 - discount_cctv) * (1 - discount_app) * (1 - discount_direct))), 2))), 2);
                        }
                    } else {
                        let forAllocation = med_premium + bb_premium;
                        med_premium = Math.round(Math.min(med_max_rate, Math.max(0, med_premium + (diff / ((1 - discount_fleet) * (1 - discount_ncb) * (1 - discount_cctv) * (1 - discount_app) * (1 - discount_direct))) * med_premium / forAllocation)), 2);
                        bb_premium = Math.round(Math.min(bb_max_rate, Math.max(0, bb_premium + (diff / ((1 - discount_fleet) * (1 - discount_ncb) * (1 - discount_cctv) * (1 - discount_app) * (1 - discount_direct))) * bb_premium / forAllocation)), 2);
                    }
                } else {
                    let forAllocation = pa_pasg_premium + med_premium + bb_premium;
                    pa_pasg_premium = Math.round(Math.min(pa_pasg_max_rate, Math.max(0, pa_pasg_premium + (diff / ((1 - discount_fleet) * (1 - discount_ncb) * (1 - discount_cctv) * (1 - discount_app) * (1 - discount_direct))) * pa_pasg_premium / forAllocation)), 2);
                    med_premium = Math.round(Math.min(med_max_rate, Math.max(0, med_premium + (diff / ((1 - discount_fleet) * (1 - discount_ncb) * (1 - discount_cctv) * (1 - discount_app) * (1 - discount_direct))) * med_premium / forAllocation)), 2);
                    bb_premium = Math.round(Math.min(bb_max_rate, Math.max(0, bb_premium + (diff / ((1 - discount_fleet) * (1 - discount_ncb) * (1 - discount_cctv) * (1 - discount_app) * (1 - discount_direct))) * bb_premium / forAllocation)), 2);
                }
            } else {
                let forAllocation = pa_driv_premium + pa_pasg_premium + med_premium + bb_premium;
                pa_driv_premium = Math.round(Math.min(pa_driv_max_rate, Math.max(0, pa_driv_premium + (diff / ((1 - discount_fleet) * (1 - discount_ncb) * (1 - discount_cctv) * (1 - discount_app) * (1 - discount_direct))) * pa_driv_premium / forAllocation)), 2);
                pa_pasg_premium = Math.round(Math.min(pa_pasg_max_rate, Math.max(0, pa_pasg_premium + (diff / ((1 - discount_fleet) * (1 - discount_ncb) * (1 - discount_cctv) * (1 - discount_app) * (1 - discount_direct))) * pa_pasg_premium / forAllocation)), 2);
                med_premium = Math.round(Math.min(med_max_rate, Math.max(0, med_premium + (diff / ((1 - discount_fleet) * (1 - discount_ncb) * (1 - discount_cctv) * (1 - discount_app) * (1 - discount_direct))) * med_premium / forAllocation)), 2);
                bb_premium = Math.round(Math.min(bb_max_rate, Math.max(0, bb_premium + (diff / ((1 - discount_fleet) * (1 - discount_ncb) * (1 - discount_cctv) * (1 - discount_app) * (1 - discount_direct))) * bb_premium / forAllocation)), 2);
            }

            basic_premium = Math.round(base * rate, 0) + pa_driv_premium + pa_pasg_premium + med_premium + bb_premium;
            calcFw = fw_rating_calculation(basic_premium, baseAv5, od_dd + tp_dd, discount_fleet, discount_ncb, discount_cctv, discount_app, discount_direct, coverage_day);
            diff = targetPremium - calcFw[0];
            loopCounter++;
        }

        return {
            message: 'Atta boii! You did it!',
            status: 'Success',
            min_premium: min_premium,
            max_premium: max_premium,
            base: base.toFixed(2),
            rate: rate,
            basic_premium: Math.round(base * rate, 0).toFixed(2),
            od_dd: od_dd.toFixed(2),
            tp_dd: tp_dd.toFixed(2),
            base_av5: baseAv5.toFixed(2),
            pa_driv: parseFloat(pa_driv_premium).toFixed(2),
            pa_pasg: parseFloat(pa_pasg_premium).toFixed(2),
            med: parseFloat(med_premium).toFixed(2),
            bb: parseFloat(bb_premium).toFixed(2),
            discount_fleet_rate: discount_fleet.toFixed(2),
            discount_fleet: calcFw[1].toFixed(2),
            discount_ncb_rate: discount_ncb.toFixed(2),
            discount_ncb: calcFw[2].toFixed(2),
            discount_direct_rate: discount_direct.toFixed(2),
            discount_direct: calcFw[3].toFixed(2),
            discount_cctv_rate: discount_cctv.toFixed(2),
            discount_cctv: calcFw[4].toFixed(2),
            discount_app_rate: discount_app.toFixed(2),
            discount_app: calcFw[5].toFixed(2),
            net_premium: calcFw[0],
            target_premium: parseFloat(targetPremium),
            new_stamp: parseFloat(Math.ceil(calcFw[0] * 0.004)).toFixed(2),
            new_vat: parseFloat(Math.round((calcFw[0] + Math.ceil(calcFw[0] * 0.004)) * 0.07, 2)).toFixed(2),
            new_gross_premium: parseFloat(Math.round(calcFw[0] + Math.ceil(calcFw[0] * 0.004) + Math.round((calcFw[0] + Math.ceil(calcFw[0] * 0.004)) * 0.07, 2), 2)).toFixed(2),
            loop_out: loopCounter,
            basic_premium_inCalc: basic_premium
        };
    }
    
});

