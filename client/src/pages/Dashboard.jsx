import { Link } from "react-router-dom";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import useWebsocket from "../utilities/useWebsocket";

export default function Dashboard() {
  const shipments = useWebsocket("ws://localhost:5050?source=dashboard");
  const financials = useWebsocket("ws://localhost:5050?source=financials");

  // Financial Functions
  const calcTotalRevenue = () => {
    if (financials) {
      return financials
        .filter((container) => container.paymentStatus === "Paid")
        .reduce((total, container) => total + container.cost, 0);
    }
    return 0;
  };

  const calcUnpaidAmount = () => {
    if (financials) {
      return financials
        .filter((container) => container.paymentStatus === "Unpaid")
        .reduce((total, container) => total + container.cost, 0);
    }
  };

  const calcInsuranceClaims = () => {
    if (financials) {
      return financials
        .filter(
          (container) =>
            container.insuranceClaimFiled &&
            container.claimDetails.claimStatus === "Approved"
        )
        .reduce(
          (total, container) => total + container.claimDetails.claimAmount,
          0
        );
    }
  };

  const calcTotalOperational = () => {
    if (financials) {
      return financials.reduce(
        (total, container) =>
          total +
          container.breakdown.baseFare +
          container.breakdown.fuelSurcharge +
          container.breakdown.insuranceFee,
        0
      );
    }
  };

  // Performance Analytics Functions
  const getMonthlyRevenue = () => {
    if (financials) {
      const revenueByMonth = financials.reduce((acc, shipment) => {
        if (shipment.paymentStatus === "Paid") {
          const month = shipment.date.slice(0, 7);
          acc[month] = (acc[month] || 0) + shipment.cost;
        }
        return acc;
      }, {});

      return Object.entries(revenueByMonth).map(([month, revenue]) => ({
        month,
        revenue,
      }));
    }
  };

  const monthlyRevenue = getMonthlyRevenue();
  console.log(monthlyRevenue);

  return (
    <div className="w-full grid grid-cols-10 gap-4 p-4">
      {/* First Column */}
      <div className="col-span-2 p-4">
        {/* Financial Summary */}
        <div className="flex flex-col gap-4">
          <h3>Financial Summary</h3>
          <hr />
          <div className="flex justify-between">
            <p>Total Revenue</p>
            <p>{calcTotalRevenue()}</p>
          </div>
          <div className="flex justify-between">
            <p>Unpaid Amounts</p>
            <p>{calcUnpaidAmount()}</p>
          </div>
          <div className="flex justify-between">
            <p>Insurance Claims</p>
            <p>{calcInsuranceClaims()}</p>
          </div>
          <div className="flex justify-between">
            <p>Profitability</p>
            <p>{calcTotalRevenue() - calcTotalOperational()}</p>
          </div>
        </div>
        {/* Performance Analytics */}
        <div>
          <LineChart data={monthlyRevenue}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="revenue" stroke="#82ca9d" />
          </LineChart>
        </div>
      </div>
      {/* Second Column */}
      <div className="col-span-5"></div>
      {/* Third Column */}
      <div className="col-span-3"></div>
    </div>
  );
}
