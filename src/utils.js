module.exports = {
    paginateResults: async (size, offset, model) => {
        let totalCount = 6, pageNumber = 0;

        if (!Number.isNaN(size) && size > 0 && size < 6) {
            totalCount = size;
        }

        if (!Number.isNaN(offset) && offset > 0) {
            pageNumber = offset;
        }

        try {
            const data = await model.findAndCountAll({
                limit: totalCount,
                offset: pageNumber * totalCount
            });

            return {
                content: data.rows,
                totalPages: Math.ceil(data.count / totalCount)
            }
        } catch (error) {
            throw new Error(error.message)
        }
    },

    paginateMerchantProducts: async (size, offset, model, id) => {
        let totalCount = 6, pageNumber = 0;

        if (!Number.isNaN(size) && size > 0 && size < 6) {
            totalCount = size;
        }

        if (!Number.isNaN(offset) && offset > 0) {
            pageNumber = offset;
        }

        try {
            const data = await model.findAndCountAll({
                limit: totalCount,
                offset: pageNumber * totalCount,
                where: {
                    merchantId: id
                }
            });

            return {
                content: data.rows,
                totalPages: Math.ceil(data.count / totalCount)
            }
        } catch (error) {
            throw new Error(error.message)
        }
    }
}

// module.exports.paginateResults = ({
//     after: cursor,
//     pageSize = 20,
//     results,
//     // can pass in a function to calculate an item's cursor
//     getCursor = () => null,
// }) => {
//     if (pageSize < 1) return [];

//     if (!cursor) return results.slice(0, pageSize);
//     const cursorIndex = results.findIndex(item => {
//         // if an item has a `cursor` on it, use that, otherwise try to generate one
//         let itemCursor = item.cursor ? item.cursor : getCursor(item);

//         // if there's still not a cursor, return false by default
//         return itemCursor ? cursor === itemCursor : false;
//     });

//     return cursorIndex >= 0
//         ? cursorIndex === results.length - 1 // don't let us overflow
//             ? []
//             : results.slice(
//                 cursorIndex + 1,
//                 Math.min(results.length, cursorIndex + 1 + pageSize),
//             )
//         : results.slice(0, pageSize);
// }