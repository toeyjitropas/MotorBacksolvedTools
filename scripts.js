let records = [];

function calculate() {
    let form = document.querySelector('.form-container');
    let vehicleId = form.querySelector('#vehicleId').value;
    let vehicleName = form.querySelector('#vehicleName').value;
    let make = form.querySelector('#make').value;
    let model = form.querySelector('#model').value;
    let registrationYear = parseInt(form.querySelector('#registrationYear').value);
    let policyEffectiveYear = parseInt(form.querySelector('#policyEffectiveYear').value);
    let oicCode = form.querySelector('#oicCode').value;
    let product = form.querySelector('#product').value;
    let od = parseFloat(form.querySelector('#od').value);
    let ft = parseFloat(form.querySelector('#ft').value);
    let tpbiPerson = parseFloat(form.querySelector('#tpbiPerson').value);
    let tpbiAccident = parseFloat(form.querySelector('#tpbiAccident').value);
    let tppdAccident = parseFloat(form.querySelector('#tppdAccident').value);
    let paDriver = parseFloat(form.querySelector('#paDriver').value);
    let paPassenger = parseFloat(form.querySelector('#paPassenger').value);
    let medicalCoverage = parseFloat(form.querySelector('#medicalCoverage').value);
    let bailbond = parseFloat(form.querySelector('#bailbond').value);
    let discountFleet = parseFloat(form.querySelector('#discountFleet').value);
    let discountNcb = parseFloat(form.querySelector('#discountNcb').value);
    let discountDirect = parseFloat(form.querySelector('#discountDirect').value);
    let discountCctv = parseFloat(form.querySelector('#discountCctv').value);
    let discountApp = parseFloat(form.querySelector('#discountApp').value);
    let preferredPremium = parseFloat(form.querySelector('#preferredPremium').value);

    let rate = mapToRate(oicCode, vehicleAge(registrationYear, policyEffectiveYear), product, od, ft, tpbiPerson, tpbiAccident, tppdAccident);
    let pa_driv_max_rate = paDriver * 0.000103222487317189;
    let pa_pasg_max_rate = paPassenger * 0.0000495259408845098;
    let med_max_rate = medicalCoverage * 0.0000650958528842174;
    let bb_max_rate = 1;

    let result = backSolve(preferredPremium, rate, od, ft, pa_driv_max_rate, pa_pasg_max_rate, bb_max_rate, med_max_rate, paDriver, medicalCoverage, paPassenger, bb_max_rate, rate, rate, discountFleet, discountNcb, discountCctv, discountApp, discountDirect, 365);
    document.getElementById('result').textContent = JSON.stringify(result, null, 2);

    records.push({
        vehicleId,
        vehicleName,
        make,
        model,
        registrationYear,
        policyEffectiveYear,
        oicCode,
        product,
        od,
        ft,
        tpbiPerson,
        tpbiAccident,
        tppdAccident,
        paDriver,
        paPassenger,
        medicalCoverage,
        bailbond,
        discountFleet,
        discountNcb,
        discountDirect,
        discountCctv,
        discountApp,
        preferredPremium,
        result
    });
}

function addRecord() {
    let recordTable = document.getElementById('recordTable');
    recordTable.innerHTML = '';
    records.forEach(record => {
        let newRow = recordTable.insertRow();
        newRow.innerHTML = `
            <td>${record.vehicleId}</td>
            <td>${record.vehicleName}</td>
            <td>${record.make}</td>
            <td>${record.model}</td>
            <td>${record.registrationYear}</td>
            <td>${record.policyEffectiveYear}</td>
            <td>${record.oicCode}</td>
            <td>${record.product}</td>
            <td>${record.od}</td>
            <td>${record.ft}</td>
            <td>${record.tpbiPerson}</td>
            <td>${record.tpbiAccident}</td>
            <td>${record.tppdAccident}</td>
            <td>${record.paDriver}</td>
            <td>${record.paPassenger}</td>
            <td>${record.medicalCoverage}</td>
            <td>${record.bailbond}</td>
            <td>${record.discountFleet}</td>
            <td>${record.discountNcb}</td>
            <td>${record.discountDirect}</td>
            <td>${record.discountCctv}</td>
            <td>${record.discountApp}</td>
            <td>${record.preferredPremium}</td>
            <td>${JSON.stringify(record.result, null, 2)}</td>
        `;
    });
}

function vehicleAge(registrationYear, policyEffectiveYear) {
    return policyEffectiveYear - registrationYear;
}

function mapToRate(oicCode, vehicleAge, product, od, ft, tpbiPerson, tpbiAccident, tppdAccident) {
    // Implement mapping logic based on your rating table
    return 1; // Dummy value for demonstration purposes
}

function fw_rating_calculation(base, base_av5, deduct, fleet_dis, ncb_dis, cctv_dis, app_dis, direct_dis, coverage_day) {
    let prem1 = base + deduct;
    let fleet_discount = -Math.round(prem1 * fleet_dis, 0);
    let ncb_discount = -Math.round((prem1 + fleet_discount) * ncb_dis, 0);
    let direct_discount = -Math.round((prem1 + fleet_discount + ncb_discount + base_av5) * direct_dis, 0);
    let cctv_discount = -Math.round((prem1 + fleet_discount + ncb_discount + direct_discount + base_av5) * cctv_dis, 0);
    let app_discount = -Math.round((prem1 + fleet_discount + ncb_discount + direct_discount + cctv_discount + base_av5) * app_dis, 0);
    return [(prem1 + fleet_discount + ncb_discount + direct_discount + cctv_discount + app_discount + base_av5) * coverage_day,
            fleet_discount, ncb_discount, direct_discount, cctv_discount, app_discount];
}

function backSolve(targetPremium, rate, od_dd, tp_dd, baseAv5, pa_driv_max_rate, pa_pasg_max_rate, bb_max_rate, med_max_rate, pa_si, me_si, base_min, base_max, discount_fleet = 0, discount_ncb = 0, discount_cctv = 0, discount_app = 0, discount_direct = 0, coverage_day = 365) {
    const min_premium = fw_rating_calculation(Math.round(base_min * rate, 0) + 4, baseAv5, od_dd + tp_dd, discount_fleet, discount_ncb, discount_cctv, discount_app, discount_direct, coverage_day)[0];
    const max_premium = fw_rating_calculation(Math.round(base_max * rate, 0) + pa_driv_max_rate + pa_pasg_max_rate + med_max_rate + bb_max_rate, baseAv5, od_dd + tp_dd, discount_fleet, discount_ncb, discount_cctv, discount_app, discount_direct, coverage_day)[0];

    if (targetPremium < min_premium) {
        return {
            message: 'Target Premium is less than Minimum Premium',
            status: 'Failed',
            min_premium: min_premium,
            max_premium: max_premium,
            target_premium: targetPremium
        };
    } else if (targetPremium > max_premium) {
        return {
            message: 'Target Premium is more than Maximum Premium',
            status: 'Failed',
            min_premium: min_premium,
            max_premium: max_premium,
            target_premium: targetPremium
        };
    }

    let pa_driv_premium = pa_si * 0.000103222487317189;
    let pa_pasg_premium = pa_si * 0.0000495259408845098;
    let med_premium = me_si * 0.0000650958528842174;
    let bb_premium = 1;

    let base = Math.min(base_max, Math.max(base_min, 
        Math.round((((targetPremium / (1 - discount_cctv) * (1 - discount_app) * (1 - discount_direct)) - baseAv5) / (1 - discount_fleet) * (1 - discount_ncb) - od_dd - tp_dd - pa_driv_premium - pa_pasg_premium - med_premium - bb_premium) / rate, 2)));

    let basic_premium = Math.round(base * rate, 0) + pa_driv_premium + pa_pasg_premium + med_premium + bb_premium;
    let calcFw = fw_rating_calculation(basic_premium, baseAv5, od_dd + tp_dd, discount_fleet, discount_ncb, discount_cctv, discount_app, discount_direct, coverage_day);
    let diff = targetPremium - calcFw[0];

    let loopCounter = 1;
    while (diff != 0) {
        if (loopCounter > 1000) {
            break;
        }

        if (pa_driv_premium == pa_driv_max_rate) {
            if (pa_pasg_premium == pa_pasg_max_rate) {
                if (med_premium == med_max_rate) {
                    if (bb_premium == bb_max_rate) {
                        return { message: 'Cannot Back-Solved!', status: 'Failed' };
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
        base: base,
        basic_premium: Math.round(base * rate, 0),
        od_dd: od_dd,
        tp_dd: tp_dd,
        base_av5: baseAv5,
        pa_driv: pa_driv_premium,
        pa_pasg: pa_pasg_premium,
        med: med_premium,
        bb: bb_premium,
        discount_fleet_rate: discount_fleet,
        discount_fleet: calcFw[1],
        discount_ncb_rate: discount_ncb,
        discount_ncb: calcFw[2],
        discount_direct_rate: discount_direct,
        discount_direct: calcFw[3],
        discount_cctv_rate: discount_cctv,
        discount_cctv: calcFw[4],
        discount_app_rate: discount_app,
        discount_app: calcFw[5],
        net_premium: calcFw[0],
        target_premium: targetPremium,
        new_stamp: Math.ceil(calcFw[0] * 0.004),
        new_vat: Math.round((calcFw[0] + Math.ceil(calcFw[0] * 0.004)) * 0.07, 2),
        new_gross_premium: Math.round(calcFw[0] + Math.ceil(calcFw[0] * 0.004) + Math.round((calcFw[0] + Math.ceil(calcFw[0] * 0.004)) * 0.07, 2), 2),
        loop_out: loopCounter,
        basic_premium_inCalc: basic_premium
    };
}
