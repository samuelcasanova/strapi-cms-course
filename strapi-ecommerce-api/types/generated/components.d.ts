import type { Schema, Struct } from '@strapi/strapi';

export interface ProductProductVariant extends Struct.ComponentSchema {
  collectionName: 'components_product_product_variants';
  info: {
    displayName: 'Product Variant';
    icon: 'bulletList';
  };
  attributes: {
    barcode: Schema.Attribute.String;
    color: Schema.Attribute.String;
    price: Schema.Attribute.Decimal;
    size: Schema.Attribute.String;
    sku: Schema.Attribute.String & Schema.Attribute.Unique;
    stock: Schema.Attribute.Integer;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'product.product-variant': ProductProductVariant;
    }
  }
}
