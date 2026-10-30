import React, { Suspense, type FC, type ReactNode } from "react";
import QCProvider from "./providers/query-provider";
import FlightProvider from "./providers/flight-provider";

interface LayoutProps {
	children: ReactNode;
}

const Layout: FC<LayoutProps> = ({ children }) => {
	return (
		<QCProvider>
			<Suspense>
				<FlightProvider>{children}</FlightProvider>
			</Suspense>
		</QCProvider>
	);
};

export default Layout;
