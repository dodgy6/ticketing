const OrderIndex = ({ orders }) => {
console.log("🚀 ~ file: index.js ~ line 2 ~ OrderIndex ~ orders", orders)
  return (
    <ul>
      {orders.map((order) => {
        return (
          <li key={order.id}>
            {order.ticket.title} - {order.status}
          </li>
        );
      })}
    </ul>
  );
};

OrderIndex.getInitialProps = async (context, client) => {
  const { data } = await client.get("/api/orders");
  console.log("🚀 ~ file: index.js ~ line 17 ~ OrderIndex.getInitialProps= ~ data", data)

  return { orders: data };
};

export default OrderIndex;
