import React, {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { grispiAPI } from "@/grispi/client/api";
import { GrispiBundle, Settings, Ticket } from "@/types/grispi.type";

type GrispiContextType = {
  ticket: Ticket | null;
  bundle: GrispiBundle | null;
  loading: boolean;
};

const GrispiContext = createContext<GrispiContextType | null>(null);

const plugin = window.Grispi.instance();

export const GrispiProvider: React.FC<{
  children: ReactNode;
}> = ({ children }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [bundle, setBundle] = useState<GrispiBundle | null>(null);
  const [ticket, setTicket] = useState<Ticket | null>(null);

  useEffect(() => {
    plugin.init().then(async (bundle: GrispiBundle) => {
      setBundle(bundle);

      grispiAPI.authentication.setTenantId(bundle.context.tenantId);
      grispiAPI.authentication.setToken(bundle.context.token);

      const ticket = await grispiAPI.tickets.getTicket(
        bundle.context.ticketKey
      );

      setTicket(ticket);
      setLoading(false);
    });

    plugin.currentTicketUpdated = async (ticket: Ticket) => {
      setLoading(true);

      try {
        const response = await grispiAPI.tickets.getTicket(ticket.key);
        setTicket(response);
      } catch (err) {
        console.error(
          "grispi-context",
          "currentTicketUpdated",
          "Error when fetching ticket details",
          ticket.key
        );
      }

      setLoading(false);
    };
  }, []);

  return (
    <GrispiContext.Provider
      value={{
        ticket,
        bundle,
        loading,
      }}
    >
      {children}
    </GrispiContext.Provider>
  );
};

export const useGrispi = () => {
  const grispi = useContext(GrispiContext);

  if (!grispi) {
    throw new Error("useGrispi must be used within a GrispiProvider.");
  }

  return grispi;
};
