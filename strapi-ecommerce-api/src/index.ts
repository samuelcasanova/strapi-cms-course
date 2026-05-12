import type { Core } from '@strapi/strapi';

export default {
  register({ strapi }: { strapi: Core.Strapi }) {
    strapi.documents.use(async (context, next) => {
      const result = await next();

      if (
        context.uid === 'api::stock-level.stock-level' &&
        context.action === 'update'
      ) {
        const { quantity, reorderPoint } = result as any;
        if (quantity != null && reorderPoint != null && quantity < reorderPoint) {
          console.log('Low stock alert:', result);
        }
      }

      return result;
    });
  },

  bootstrap(/* { strapi }: { strapi: Core.Strapi } */) {},
};
