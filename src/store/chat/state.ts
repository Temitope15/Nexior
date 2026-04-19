import { CHAT_MODEL_GEMINI_3_0_PRO, CHAT_MODEL_GROUP_GEMINI } from '@/constants';
import { IChatState } from './models';
import { Status } from '@/models';

export default (): IChatState => {
  return {
    model: CHAT_MODEL_GEMINI_3_0_PRO,
    modelGroup: CHAT_MODEL_GROUP_GEMINI,
    applications: undefined,
    application: undefined,
    conversations: undefined,
    service: undefined,
    credential: undefined,
    status: {
      getService: Status.None,
      getApplications: Status.None,
      getConversations: Status.None
    }
  };
};
