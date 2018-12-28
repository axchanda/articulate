import {
    MODEL_AGENT,
    MODEL_CATEGORY,
    STATUS_OUT_OF_DATE
} from '../../../util/constants';
import RedisErrorHandler from '../../errors/redis.error-handler';

module.exports = async function ({ id, categoryId, categoryData, returnModel = false }) {

    const { globalService } = await this.server.services();

    try {
        const modelPath = [MODEL_AGENT, MODEL_CATEGORY];
        const modelPathIds = [id, categoryId];

        // Load Used Models
        const models = await globalService.getAllModelsInPath({ modelPath, ids: modelPathIds, returnModel: true });
        const AgentModel = models[MODEL_AGENT];
        const CategoryModel = models[MODEL_CATEGORY];
        categoryData.status = STATUS_OUT_OF_DATE;
        await CategoryModel.updateInstance({ data: categoryData });
        // TODO: Publish Agent update
        AgentModel.property('status', STATUS_OUT_OF_DATE);
        await AgentModel.saveInstance();
        return returnModel ? CategoryModel : CategoryModel.allProperties();
    }
    catch (error) {
        throw RedisErrorHandler({ error });
    }
};
