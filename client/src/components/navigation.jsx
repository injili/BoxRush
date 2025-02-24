import theLogo from "../assets/img/logo.png";

export default function Navigation() {
  return (
    <div className="flex justify-between">
      <div>
        <img width="240" src={theLogo} alt="The BoxRush Logo" />
      </div>
      <div>
        <ul className="flex gap-2">
          <li>Admin Dashboard</li>
          <li>Shipment Records</li>
          <li>Drivers Panel</li>
          <li>Customer Panel</li>
        </ul>
      </div>
    </div>
  );
}
