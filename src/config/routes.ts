import { tours } from "../data/tours";
import { destinations } from "../data/destinations";

export const publicRoutes = ["/", "/tours", "/about", "/reviews", "/faq", "/contacts",
  ...tours.map((tour) => `/tours/${tour.slug}`),
  ...destinations.map((destination) => `/destinations/${destination.id}`)];
