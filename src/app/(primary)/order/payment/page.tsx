import { auth } from "@/auth";
import { fetchCodes } from "@/data/fetch/fetchCode";
import { AirportData } from "@/types";
import Receipt from "../Receipt";
import PaymentForm from "./PaymentForm";

const PaymentPage = async () => {
  const session = await auth();
  const { code } = await fetchCodes<AirportData>();

  return (
    <div className="order-inner payment flexVer">
      <div className="left-box">
        <section>
          <PaymentForm user={session?.user} code={code} />
        </section>
      </div>

      <aside className="right-box receipt-box">
        <Receipt />
      </aside>
    </div>
  );
};

export default PaymentPage;
