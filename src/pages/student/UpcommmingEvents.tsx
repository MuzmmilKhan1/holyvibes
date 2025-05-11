import SpinnerLoader from "@/components/SpinLoader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useGetAndDelete from "@/hooks/useGetAndDelete";
import usePostAndPut from "@/hooks/usePostAndPut";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "sonner";

// Define types
interface EventDetails {
  id: number;
  title: string;
  description: string;
  price: number;
  time: string;
}

interface EventItem {
  studentID: number;
  id: number;
  userID: number;
  eventID: number;
  is_member: boolean;
  payment_status: "pending" | "not_required" | "paid" | 'rejected';
  event: EventDetails;
}

const UpcommmingEvents: React.FC = () => {
  const getEvents = useGetAndDelete(axios.get);
  const updateMembership = useGetAndDelete(axios.get);
  const postEventPayment = usePostAndPut(axios.post);

  const [showPayment, setShowPayment] = useState(false);

  const [formData, setFormData] = useState<{
    eventID: number | null,
    receipt: File | null;
    method: string;
  }>({
    eventID: null,
    receipt: null,
    method: "",
  });

  const fetchEventData = async () => {
    const response = await getEvents.callApi("event/get-std-events", false, false);
    console.log(response?.events);
  };

  useEffect(() => {
    fetchEventData();
  }, []);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.receipt || !formData.method) {
      toast.error("Please select a payment method and upload a receipt.");
      return;
    }
    const response = await postEventPayment.callApi('event/event-payment', formData, false, true, true);
    console.log(response)

    try {
      setShowPayment(false);
    } catch (error) {
      console.error("Payment submission failed:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  const cancelMembershipOrJoin = async (eventID: number, studentID: number) => {
    const response = await updateMembership.callApi(`event/join-cancel-membership/${eventID}/${studentID}`, false, false)
    await fetchEventData();
    console.log(response)
  }

  return (
    <div className="p-6 w-full h-full flex flex-col flex-wrap gap-3">
      {getEvents.loading ? (
        <SpinnerLoader color="black" />
      ) : getEvents?.response?.events.length > 0 && !showPayment ? (
        getEvents?.response?.events.map((event: EventItem, idx: number) => (
          <div key={idx} className="border w-full h-auto p-4 rounded-xl">
            <p className="font-bold text-lg">{event.event?.title || "Untitled"}</p>
            <p className="mt-2">{event.event?.description || "No description"}</p>
            <p className="font-semibold mt-2">
              {event.event?.price !== null ? `$${event.event?.price}` : "Free"}
            </p>
            <div className="mt-2 flex items-center justify-between">
              <p>{new Date(event.event?.time).toLocaleString()}</p>
              <div className="flex gap-2">
                {(event.payment_status === "pending" || event.payment_status === "rejected") && (
                  <Button
                    onClick={() => {
                      setFormData((prev) => ({
                        ...prev,
                        eventID: event.eventID || event.event?.id,
                      }));
                      setShowPayment(true);
                    }}

                  >
                    Purchase
                  </Button>
                )}

                {(event.payment_status === "not_required" || event.payment_status === "paid") && (
                  event.is_member ? (
                    <>
                      {
                        updateMembership.loading ?
                          <Button variant="destructive" disabled>Leave</Button> :
                          <Button variant="destructive"
                            onClick={() => cancelMembershipOrJoin(event.event?.id, event?.studentID)}
                          >Leave</Button>
                      }
                    </>

                  ) : (
                    <>
                      {
                        updateMembership.loading ?
                          <Button
                            disabled
                          >Join</Button> :
                          <Button
                            onClick={() => cancelMembershipOrJoin(event.event?.id, event?.studentID)}
                          >Join</Button>
                      }
                    </>
                  )
                )}
              </div>
            </div>
          </div>
        ))
      ) : (
        !showPayment && <p >No upcoming events found.</p>
      )}

      {showPayment && (
        <div>
          <div className="w-full grid place-items-center">
            <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border p-6 rounded-xl w-full">
                <h2 className="text-xl font-semibold mb-4">Payment Details</h2>
                <form onSubmit={handleFormSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="receipt">Upload Receipt</Label>
                    <Input
                      id="receipt"
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        setFormData({ ...formData, receipt: e.target.files?.[0] || null })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="payment-method">Payment Method</Label>
                    <Select
                      onValueChange={(value: any) => setFormData({ ...formData, method: value })}
                    >
                      <SelectTrigger id="payment-method">
                        <SelectValue placeholder="Select a payment method" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="jazzcash">JazzCash</SelectItem>
                        <SelectItem value="bank">Bank Transfer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button
                    disabled={postEventPayment.loading}
                    type="submit" className="w-full">
                    Submit Payment
                  </Button>
                </form>
              </div>
              <div className="border p-6 rounded-xl w-full">
                <h2 className="text-lg font-medium mb-2">Payment Instructions</h2>
                <p className="text-sm text-gray-600">
                  Please upload a clear receipt image and select your payment method. Once verified,
                  your event access will be granted.
                </p>
                <div className="mt-6">
                  <Button variant="outline" onClick={() => setShowPayment(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full grid place-items-center mt-4">
            <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border p-4 rounded-lg ">
                <p className="font-bold underline text-xl" >For Pakistani Students</p>

                <p className="text-lg underline mt-2 font-bold" >Bank Payemnt</p>
                <p className="mt-1" ><strong>Bank:</strong> United Bank Limited (UBL)</p>
                <p> <strong>Account Number:</strong> 309795098</p>
                <p> <strong>Account Title:</strong> Aneeqa Saeed </p>

                <p className="text-lg underline mt-2 font-bold" >Jazz Cash Payment</p>
                <p> <strong>Account Number:</strong> 0321-0102288</p>
                <p> <strong>Account Title:</strong> Aneeqa Saeed </p>

              </div>
              <div className="border p-4 rounded-lg ">
                <p className="font-bold underline text-xl" >For International Students</p>
                <p className="text-lg underline mt-2 font-bold" >Bank Payemnt</p>
                <p className="mt-1" ><strong>Bank:</strong> ENBD EMIRATES BANK</p>
                <p> <strong>Account Number:</strong> 5922140601</p>
                <p> <strong>IBAN Number:</strong> AE330260000125922140601</p>
                <p> <strong>Account Title:</strong> Aneeqa Saeed </p>
              </div>
            </div>
          </div>


        </div>
      )}
    </div>
  );
};

export default UpcommmingEvents;
