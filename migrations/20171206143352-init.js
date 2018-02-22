'use strict';

var dbm;
var type;
var seed;

var categories = [
    {
        id: "1",
        name: "Active Life",
        subcategories: [
            {
                id: "1.1",
                name: "Sport"
            },
            {
                id: "1.2",
                name: "Fitness"
            },
            {
                id: "1.3",
                name: "Travelling"
            }
        ]
    },
    {
        id: "2",
        name: "Nightlife",
        subcategories: [
            {
                id: "2.1",
                name: "Clubs"
            },
            {
                id: "2.2",
                name: "Bars"
            },
            {
                id: "2.3",
                name: "Restaurants"
            }
        ]
    },
    {
        id: "3",
        name: "Shopping",
        subcategories: [
            {
                id: "3.1",
                name: "Fashion"
            },
            {
                id: "3.2",
                name: "Flowers & Gifts"
            },
            {
                id: "3.3",
                name: "Sport Goods"
            }
        ]
    },
    {
        id: "4",
        name: "Food",
        subcategories: [
            {
                id: "4.1",
                name: "Coffee & Tea"
            },
            {
                id: "4.2",
                name: "Grocery"
            },
            {
                id: "4.3",
                name: "Ice-Cream & Frozen Yogurt"
            }
        ]
    },
    {
        id: "5",
        name: "Art & Entertainment",
        subcategories: [
            {
                id: "5.1",
                name: "Art"
            },
            {
                id: "5.2",
                name: "Cinema"
            },
            {
                id: "5.3",
                name: "Museums"
            }
        ]
    },
    {
        id: "6",
        name: "Beauty & Spa",
        subcategories: [
            {
                id: "6.1",
                name: "Hair Salon"
            },
            {
                id: "6.2",
                name: "Massage"
            },
            {
                id: "6.3",
                name: "Nail Salon",
            }
        ]
    },
    {
        id: "7",
        name: "Digital",
        subcategories: [
            {
                id: "7.1",
                name: "Digital Marketing"
            },
            {
                id: "7.2",
                name: "Mobile Content"
            },
            {
                id: "7.3",
                name: "Social Media"
            }
        ]
    },
    {
        id: "8",
        name: "E-Marketplace",
        subcategories: [
            {
                id: "8.1",
                name: "Multi product"
            },
            {
                id: "8.2",
                name: "Electronics"
            },
            {
                id: "8.3",
                name: "Furniture"
            }
        ]
    }
];

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function(db) {
  return db.insert("categories", categories, () => {});
};

exports.down = function(db) {
  return null;
};

exports._meta = {
  "version": 1
};

