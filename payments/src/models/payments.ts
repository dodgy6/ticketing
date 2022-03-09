import moongose from "mongoose";

interface PaymentAttrs {
  orderId: string;
  stripeId: string;
}

interface PaymentDocs extends moongose.Document {
  orderId: string;
  stripeId: string;
}

interface PaymentModel extends moongose.Model<PaymentDocs> {
  build(attrs: PaymentAttrs): PaymentDocs;
}

const PaymentSchema = new moongose.Schema(
  {
    orderId: {
      type: String,
      required: true,
    },
    stripeId: {
      type: String,
      required: true,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

PaymentSchema.statics.build = (attrs: PaymentAttrs) => {
  return new Payment(attrs);
};

const Payment = moongose.model<PaymentDocs, PaymentModel>(
  "Payment",
  PaymentSchema
);

export { Payment };
