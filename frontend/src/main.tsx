import ReactDOM from "react-dom/client";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { NotFound, ErrorPage } from "@/components";

const queryClient = new QueryClient();

const router = createRouter({
	routeTree,
	defaultPreload: "intent",
	defaultPreloadStaleTime: 0,
	context: { queryClient },
	defaultPendingComponent: () => (
		<Backdrop
			sx={(theme) => ({ color: "#fff", zIndex: theme.zIndex.drawer + 1 })}
			open
		>
			<CircularProgress color="primary" size="3.5rem" />
		</Backdrop>
	),
	defaultNotFoundComponent: NotFound,
	defaultErrorComponent: ({ error }) => <ErrorPage error={error} />,
});

declare module "@tanstack/react-router" {
	interface Register {
		router: typeof router;
	}
}

// biome-ignore lint/style/noNonNullAssertion: ROOT ELEMENT INIT
const rootElement = document.getElementById("app")!;

if (!rootElement.innerHTML) {
	const root = ReactDOM.createRoot(rootElement);
	root.render(
		<QueryClientProvider client={queryClient}>
			<RouterProvider router={router} />
		</QueryClientProvider>,
	);
}
