import {getLoggerForFile, stringify, stringifyArray, stringifyObj} from "../util/loggerUtil";
// import {PROMO_REWARD_TYPE_SEPARATE_PRODUCT} from "../constants/promoRewardType";
// import {PROMO_CARD_STATUS_ACTIVE} from "../constants/promoCardStatus";

const logger = getLoggerForFile(__filename);

export function getUserCompanyEntity(company, reqIdentifier) {
    logger.info(`[${reqIdentifier}][getUserCompanyEntity] Attempt to create user company entity.`);

    const completed = !!(company.name
        && company.description
        && company.webAddress
        && company.phone
        && company.email
        && company.logo
        && (company.category && company.category.name)
        && (company.lat && company.lng && company.locationName));

    return {
        ...company._doc,
        completed,
    };
}

// export function getCompanyProductEntity(product, reqIdentifier) {
//     logger.info(`[${reqIdentifier}][getCompanyProductEntity] Attempt to create company product entity.
//          \nproduct: ${stringifyObj(product)}`);
//
//     return {
//         _id: product._id,
//
//         category: product.category,
//         companyId: product.companyId,
//         description: product.description,
//         expTimestamp: product.expTimestamp,
//         isOffline: product.isOffline,
//         isOnline: product.isOnline,
//         isUnlimited: product.isUnlimited,
//         language: product.language,
//         link: product.link,
//         name: product.name,
//         object: product.objectId,
//         price: product.price,
//         quantity: product.quantity,
//         pics: product.pics,
//     };
// }

export function getSigninResultEntity(user, company, reqIdentifier) {
    logger.info(`[${reqIdentifier}][getSigninResultEntity] Attempt to create signin result entity.` +
        `\nUser: ${stringify(user)}
         \nCompany: ${stringifyObj(company)}`);

    return {
        userName: user.name,
        userId: user._id,
        name: company ? company.name : "",
    };
}

export function getUserInfo(user, reqIdentifier) {
    logger.info(`[${reqIdentifier}][getUserInfo] Attempt to create user info entity.` +
        `\nuser: ${stringify(user)}`);

    return {
        userName: user.name,
    };
}

export function getSigninPayload(signinResult, reqIdentifier) {
    logger.info(`[${reqIdentifier}][getSigninPayload] Attempt to create signin payload entity.` +
        `\nsigninResult: ${stringify(signinResult)}`);

    return {
        userName: signinResult.userName,
        name: signinResult.name,
    };
}

export function getSignupUserResultEntity(user, reqIdentifier) {
    logger.info(`[${reqIdentifier}][getSignupResultEntity] Attempt to create signup user result entity.` +
        `\nUser: ${stringify(user)}`);

    return {
        userName: user.name,
        userId: user._id,
    };
}

export function getPromoEntity(promo, reqIdentifier) {
    logger.info(`[${reqIdentifier}][getPromoEntity] Attempt to create promo entity
        \npromo: ${stringify(promo)}`);

    return {
        createdTimestamp: promo.createdTimestamp,
        name: promo.name,
        offerPhrase: promo.offerPhrase,
        about: promo.about,
        terms: promo.terms,
        objective: promo.objective,
        productId: promo.productId,
        rewardType: promo.reward.rewardType,
        separateProductId: promo.reward.rewardId,
        discount: promo.reward.percentage,
        type: promo.promoType,
        condition: promo.condition,
        quantity: promo.quantityValue,
        isUnlimitedQuantity: promo.quantityUnlimited,
        value: promo.value,
        codes: promo.codes.join("\n"),
        time2Decide: promo.timeToDecide,
        age: promo.target.age,
        gender: promo.target.gender,
        scheduleType: promo.scheduleType,
        pricing: promo.pricing,
        language: promo.target.language,
        productObject: promo.promoProductObject,
        locationObj: promo.target.location,
        budgetPeriod: promo.budgetPeriod,
        budgetAmount: promo.budgetAmount,
        finishDateTime: promo.finishDate,
        startDateTime: promo.startDate,
        status: promo.status,
        codeType: promo.codeType,
        imgCode: promo.promoImgCode,
        interest: promo.target.interests,
        _id: promo._id,
        dataLanguage: promo.dataLanguage,
    };
}

// export function getPromoStatistics(promos, promoCards, reqIdentifier) {
//     logger.info(`[${reqIdentifier}][getPromoCards] Attempt to create company promo cards.` +
//         `\npromoCards: ${stringifyArray(promoCards)}
//          \npromos: ${stringifyArray(promos)}`);
//
//     const res = [];
//     let activates;
//     let acquisitions;
//     let rejections;
//     let saves;
//     let views;
//     let shares;
//     let companyInfoShows;
//
//     if (promoCards && promoCards.length && promos && promos.length) {
//         for (const promo of promos) {
//             activates = 0;
//             acquisitions = 0;
//             rejections = 0;
//             saves = 0;
//             views = 0;
//             companyInfoShows = 0;
//             shares = 0;
//
//             for (const card of promoCards) {
//                 if (promo._id.toString() === card.promoId.toString()) {
//                     acquisitions += card.acquisitions;
//                     rejections += card.rejections;
//                     saves += card.saves;
//                     views += card.views;
//                     companyInfoShows += card.companyInfoShows;
//                     shares += card.shares;
//
//                     if (card.status === PROMO_CARD_STATUS_ACTIVE) {
//                         activates++;
//                     }
//                 }
//             }
//
//             res.push({
//                 promoId: promo._id,
//                 name: promo.name,
//                 status: promo.status,
//                 acquisitions,
//                 rejections,
//                 saves,
//                 views,
//                 companyInfoShows,
//                 activates,
//                 shares,
//             });
//         }
//     }
//
//     return res;
// }

// export function getUserCards(cards, companies, promos, products, reqIdentifier) {
//     logger.info(`[${reqIdentifier}][getUserCards] Attempt to create richBit user cards.` +
//         `\ncards: ${stringifyArray(cards)}
//          \ncompanies: ${stringifyArray(companies)}
//          \npromos: ${stringifyArray(promos)}
//          \nproducts: ${stringifyArray(products)}`);
//
//     const res = [];
//     let _company;
//     let _promo;
//     let _product;
//     let _reward;
//     let _subcategory;
//     let location;
//
//     for (const card of cards) {
//         for (const promo of promos) {
//             if (promo._id.toString() === card.promoId.toString()) {
//                 location = {};
//                 _company = {};
//                 _promo = {};
//                 _product = {};
//                 _reward = {};
//                 _subcategory = "";
//
//                 _promo = promo;
//
//                 for (const company of companies) {
//                     if (promo.companyId && company._id.toString() === promo.companyId.toString()) {
//                         _company = company;
//                         break;
//                     }
//                 }
//
//                 for (const product of products) {
//                     if (product._id.toString() === promo.productId.toString()) {
//                         _product = product;
//                         break;
//                     }
//                 }
//
//                 if (_promo.reward.rewardType === PROMO_REWARD_TYPE_SEPARATE_PRODUCT && _promo.reward.rewardId) {
//                     for (const product of products) {
//                         if (product._id.toString() === promo.reward.rewardId.toString()) {
//                             _reward = product;
//                             break;
//                         }
//                     }
//                 }
//
//                 const time2decide = _promo.createdTimestamp + _promo.timeToDecide * 60 * 60 * 1000;
//                 let status = card.status;
//                 const currentDate = Date.now();
//                 if (time2decide <= currentDate) {
//                     status = "EXPIRED";
//                 }
//
//                 res.push({
//                     cardId: card._id,
//                     status: status,
//
//                     company: {
//                         name: _company.name,
//                         logo: _company.logo,
//                         about: _company.about,
//                         category: _company.category && _company.category.name ? _company.category.name : "",
//                         subcategory: _company.category
//                         && _company.category.subcategories
//                         && _company.category.subcategories.length ?
//                             _company.category.subcategories[_company.category.subcategories.length - 1].name : "",
//                         website: _company.webAddress,
//                         email: _company.email,
//                         phone: _company.phone,
//                         address: _company.location && _company.location.name ? _company.location.name : "",
//                         location: _company.location && _company.location.lat && _company.location.lan ? {
//                             lat: _company.location.lat,
//                             lan: _company.location.lan,
//                         } : {},
//                     },
//                     promo: {
//                         offer: _promo.offerPhrase,
//                         about: _promo.about,
//                         terms: _promo.terms,
//                         price: _product.price,
//                         type: _promo.promoType,
//                         condition: _promo.condition,
//                         activationText: _promo.codeType === "PROMO_CODE_TYPE_CODE" ? card.code : "",
//                         activationImg: _promo.codeType === "PROMO_CODE_TYPE_BAR_QR" ? _promo.promoImgCode : "",
//                         timeToDecide: time2decide,
//                         lat: _promo.target.location.lat,
//                         lng: _promo.target.location.lng,
//                     },
//                     product: {
//                         link: _product.link,
//                         price: _product.price,
//                         pics: _product.pics,
//                     },
//                     reward: {
//                         type: _promo.reward.rewardType,
//                         link: _reward ? _reward.link : "",
//                         pics: _reward ? _reward.pics : [],
//                         percentage: _promo.reward.percentage,
//                     },
//                 });
//             }
//         }
//     }
//
//     return res;
// }
