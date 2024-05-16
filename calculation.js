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

function backSolve(targetPremium, rate, od_dd, tp_dd, baseAv5, pa_driv_max_rate, pa_pasg_max_rate, bb_max_rate, med_max_rate, pa_si, me_si, base_min, base_max, discount_fleet=0, discount_ncb=0, discount_cctv=0, discount_app=0, discount_direct=0, coverage_day=365) {
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

    // Initialize PA, ME, BB
    let pa_driv_premium = pa_si * 0.000103222487317189;
    let pa_pasg_premium = pa_si * 0.0000495259408845098;
    let med_premium = me_si * 0.0000650958528842174;
    let bb_premium = 1;

    // Finding initial Base
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
