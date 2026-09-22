import { useState } from "react";
import "./checkoutPage.css";

// Keeping types and mock data here for simplicity.
type Book = {
  id: number;
  title: string;
  author: string;
  coverImageUrl: string;
  price: number;
};

type Address = {
  street: string;
  city: string;
  state: string;
  zip: string;
};

// I am not inputting real image URLs for time's sake.
const books: Book[] = [
  {
    id: 1,
    title: "The Brothers Karamazov",
    author: "Fyodor Dostoevsky",
    coverImageUrl: "#",
    price: 20,
  },
  {
    id: 2,
    title: "Book 2",
    author: "Fyodor Dostoevsky",
    coverImageUrl: "#",
    price: 10,
  },
  {
    id: 3,
    title: "Book 3",
    author: "Fyodor Dostoevsky",
    coverImageUrl: "#",
    price: 15,
  },
  {
    id: 4,
    title: "Book 4",
    author: "Fyodor Dostoevsky",
    coverImageUrl: "#",
    price: 8000,
  },
];

const address: Address = {
  street: "street name",
  city: "New York",
  state: "New York",
  zip: "10000",
};

export function CheckoutPage() {
  const [orderId, setOrderId] = useState("");
  const [shippingDate, setShippingDate] = useState("");
  // Keeping track of error message here so I may print it out on the page.
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const priceTotal = books.reduce((sum, book) => sum + book.price, 0);

  const placeOrder = async () => {
    setLoading(true);
    setError("");

    try {
      /**I am assuming I do not need to build out this API endpoint with mock data, so I will let the error message appear
       * and let the code speak for itself. I assume this does not have to work perfectly and simply show knowledge and ability.
       * I also just opted to use basic fetch since this is a very simple api call and does not require complexity.
       **/
      const response = await fetch("api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bookIds: books.map((book) => book.id),
        }),
      });

      // Extra catch in case the response comes back as an error.
      if (!response.ok) {
        const responseError = response.body;
        setError(
          "There was a problem placing your order: Error " + { responseError },
        );
      }

      const data: {
        orderId: string;
        estimatedShippingDate: string;
      } = await response.json();

      setOrderId(data.orderId);
      setShippingDate(data.estimatedShippingDate);
      setLoading(false);
    } catch {
      setError("There was a problem placing your order.");
      setLoading(false);
    }
  };

  return (
    // I am putting the entire page into this component for simplicity.
    // In reality, this would be broken up into several components/sections.
    <main className="main-page">
      <h1>Checkout</h1>
      <section className="books-list-section">
        <ul className="books-list">
          {books.map((book) => (
            <li className="book-item">
              <img src={book.coverImageUrl} alt={book.title} width="100" />
              <div className="book-details">
                <h3>{book.title}</h3>
                <p>{book.author}</p>
                <p>${book.price}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>
      <section>
        <h2>Order Total</h2>
        <p>{priceTotal}</p>
      </section>
      <section>
        <h2>Shipping Address</h2>
        <p>{address.street}</p>
        <p>
          {address.city}, {address.state} {address.zip}
        </p>
      </section>
      <section>
        <button className="order-button" onClick={placeOrder}>
          Place Order
        </button>
      </section>
      <section>
        <h2>Order Confirmation</h2>
        {loading && <p>Loading...</p>}
        {orderId && (
          <p>
            Congratulations! Your order has been processed! Your order id is{" "}
            {orderId} and will be shipped on {shippingDate}!
          </p>
        )}
        {error && <p>{error}</p>}
      </section>
    </main>
  );
}
