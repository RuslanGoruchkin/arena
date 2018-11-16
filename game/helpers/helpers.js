/* eslint-disable destructuring/no-rename */
import _ from "lodash";

export const difference = (object, base) =>
    _.transform(object, (result, value, key) => {
        if (!_.isEqual(value, base[key])) {
            result[key] = _.isObject(value) && _.isObject(base[key]) ? difference(value, base[key]) : value;
        }
    });

export const mapCollectionToMatrixReducer = (items = []) =>
    items.reduce(
        (accum, item) => {
            const { floor, x, y, data, "accesses.owner": owner, "accesses.mapItemId": mapItemId } = item;
            const { map, access } = accum;
            _.set(map, `[${floor}][${x}][${y}]`, data);
            if (owner && mapItemId) {
                if (!_.has(access, floor)) {
                    access[floor] = {};
                }
                _.set(access, `[${floor}][${owner}][${x}][${y}]`, true);
            }
            return { map, access };
        },
        {
            map: {},
            access: {}
        }
    );
export const mapMatrixToCollection = matrix => {
    let collection = [];
    _.forEach(matrix, (floorValue, floor) => {
        _.forEach(floorValue, (xValue, x) => {
            // eslint-disable-next-line lodash/prefer-map
            _.forEach(xValue, (data, y) => {
                collection.push({
                    id: `${floor}--${x}--${y}`,
                    x,
                    y,
                    floor,
                    data
                });
            });
        });
    });
    return collection;
};
export const accessMatrixToCollection = matrix => {
    let newMap = [];
    let newAccess = [];
    _.forEach(matrix, (floorValue, floor) => {
        _.forEach(floorValue, (playerValue, owner) => {
            _.forEach(playerValue, (xValue, x) => {
                _.forEach(xValue, (data, y) => {
                    newMap.push({
                        id: `${floor}--${x}--${y}`,
                        x,
                        y,
                        floor
                    });
                    newAccess.push({
                        mapItemId: `${floor}--${x}--${y}`,
                        owner: owner
                    });
                });
            });
        });
    });
    return { newMap, newAccess };
};
