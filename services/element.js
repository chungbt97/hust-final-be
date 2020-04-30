const ElementModel = require('../models/element');
const BlockModel = require('../models/block');
const errorCodes = require('../constants/errors');
const CustomError = require('../common/CustomError');
const blockCodes = require('../constants/block');

const updateListElements = async (data) => {
    const { elmentArr, blockId, elementDeleteArr } = data;
    const block = await Block.findOne({ _id: blockId, deleteFlag: false });
    if (!block) throw new CustomError(errorCodes.BAD_REQUEST);
    // add and update
    for (let i = 0; i < elmentArr.length; i++) {
        let element = elementArr[i];
        let attachment_msg = handleRawElement(element);
        if (element._id) {
            let elementUpdate = await ElementModel.findOneandUpdate(
                { _id: element._id, block_id: blockId },
                {
                    $set: {
                        attachment_msg: attachment_msg,
                        text_msg: element.text_msg,
                        attribute: element.attribute,
                    },
                },
                { new: true },
            );
            if (!elementUpdate) throw new CustomError(errorCodes.BAD_REQUEST);
        } else {
            let { text_msg, element_type, attribute } = element;
            let newElment = await ElementModel.create({
                attachment_msg,
                text_msg,
                attribute,
                element_type,
                block_id: blockId,
            });
            let block = await BlockModel.findByIdAndUpdate(
                blockId,
                {
                    $push: { elements: newElment._id },
                },
                { new: true },
            );
        }
    }
    // delete elment
    if (elementDeleteArr.length > 0) {
        for (let i = 0; i < elementDeleteArr.length; i++) {
            let element = elementDeleteArr[i];
            let e = await ElementModel.findByIdAndUpdate(element._id, {
                deleteFlag: true,
            });
        }
    }
};

const handleRawElement = (rawElement) => {
    let elementType = rawElement.element_type;
    if (elementType === blockCodes.TYPE_IMAGE) {
        return {
            payload: {
                elements: [
                    {
                        media_type: 'image',
                        url: rawElement.imageUrl,
                    },
                ],
                template_type: 'media',
            },
            type: 'template',
        };
    } else if (elementType === blockCodes.TYPE_LIST) {
        let elements = rawElement.elements.map((e) => {
            return {
                title: e.title,
                subtitle: e.subtitle,
                image_url: e.imageUrl,
                default_action: {
                    type: 'oa.open.url',
                    url: e.url,
                },
            };
        });
        return {
            type: 'template',
            payload: {
                template_type: 'list',
                elements: elements,
            },
        };
    }
};

module.exports = { updateListElements };
