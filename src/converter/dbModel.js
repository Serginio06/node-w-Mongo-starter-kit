import {getLoggerForFile, stringify, stringifyObj} from "../util/loggerUtil";
// import {PROMO_STATUS_ACTIVE, PROMO_STATUS_DRAFT} from "../constants/promoStatus";
// import {PROMO_CARD_STATUS_CLOSED} from "../constants/promoCardStatus";

const logger = getLoggerForFile(__filename);

export function getUser(firstName, familyName, email, credential, isOnDispatch, reqIdentifier) {
    logger.info(`[${reqIdentifier}][getUser] Attempt to create user entity.` +
        `\nfirstName: ${stringify(firstName)}
         \nfamilyName: ${stringify(familyName)}
         \nemail: ${stringify(email)}
         \ncredential: ${stringify(credential)}
         \nisOnDispatch: ${stringify(isOnDispatch)}`);

    return {
        name: `${firstName} ${familyName}`,
        email,
        verified: false,
        password: credential,
        isOnDispatch: !!isOnDispatch,
    };
}

// export function getCompanyProduct(product2edit, reqIdentifier) {
//     logger.info(`[${reqIdentifier}] [getCompanyProduct] attempt to create company product entity.
//             \nproduct2edit: ${stringifyObj(product2edit)}`);
//
//     return {
//         companyId: product2edit.companyId,
//         name: product2edit.name,
//         category: product2edit.category,
//         description: product2edit.description,
//         objectId: product2edit.object,
//         price: product2edit.price,
//         quantity: product2edit.quantity,
//         link: product2edit.link2product,
//         expTimestamp: product2edit.expDate,
//         isUnlimited: product2edit.isUnlimitedQuantity,
//         isOnline: product2edit.isOnline,
//         isOffline: product2edit.isOffline,
//         language: product2edit.dataLanguage,
//         pics: product2edit.images,
//     };
// }

// export function getFacebookUser(name, facebookId, reqIdentifier) {
//     logger.info(`[${reqIdentifier}][getUser] Attempt to create facebook user entity.` +
//         `\nname: ${stringify(name)}
//          \nfacebookId: ${stringify(facebookId)}`);
//
//     return {
//         name,
//         facebookId,
//         verified: true,
//     };
// }

export function getVerificationCode(userId, target, hash, reqIdentifier) {
    logger.info(`[${reqIdentifier}][getVerificationCode] Attempt to create verification code entity.` +
        `\nuserId: ${stringify(userId)}
         \ntarget: ${stringify(target)}
         \nhash: ${stringify(hash)}`);

    return {
        userId,
        target,
        hash,
    };
}

// export function getCompany(userId, company, reqIdentifier) {
//     logger.info(`[${reqIdentifier}] [getCompany] Attempt to create company entity.
//        \nuserId: ${stringify(userId)}
//        \ncompany.: ${stringifyObj(company)}`);
//
//     return {
//         userId,
//         name: company.name,
//         description: company.description,
//         email: company.email,
//         showEmail: company.showEmail,
//         phone: company.phone,
//         showPhone: company.showPhone,
//         webAddress: company.webAddress,
//         showWebAddress: company.showWebAddress,
//         locationName: company.locationName,
//         showLocation: company.showLocation,
//         lat: company.lat,
//         lng: company.lng,
//         category: {
//             name: company.category && company.category.name ? company.category.name : null,
//             id: company.category && company.category.id ? company.category.id : null,
//             subcategories: company.category && company.category.subcategories ? company.category.subcategories : [],
//         },
//         logo: company.logo,
//         dataLanguage: company.dataLanguage,
//         links: company.links,
//     };
// }



// export function getPromoCard(promoId, code, reqIdentifier) {
//     logger.info(`[${reqIdentifier}][getPromoCard] attempt to create new promo card db entity
//         \npromoId: ${stringify(promoId)}
//         \ncode: ${stringify(code)}`);
//
//     return {
//         promoId,
//         status: PROMO_CARD_STATUS_CLOSED,
//         code,
//         acquisitions: 0,
//         rejections: 0,
//         saves: 0,
//         views: 0,
//         shares: 0,
//         companyInfoShows: 0,
//     };
// }
