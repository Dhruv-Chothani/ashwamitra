"use client"

import { useState } from "react"
import { 
  Package, Truck, MapPin, CheckCircle, Clock, User, Phone, 
  Calendar, CreditCard, AlertCircle, RefreshCw, Eye, 
  ChevronRight, Home, Box, ArrowRight, Check, X
} from "lucide-react"

interface DeliveryItem {
  id: string
  order: string
  customer: string
  customerPhone: string
  customerAddress: string
  customerImage: string
  partner: string
  partnerPhone: string
  status: "Pending Approval" | "Processing" | "Picked Up" | "In Transit" | "Out for Delivery" | "Delivered" | "Cancelled"
  payment: string
  amount: string
  estimatedDelivery?: string
  actualDelivery?: string
  pickupTime?: string
  trackingNumber?: string
  notes?: string
  deliveryPerson?: string
  images?: string[]
}

interface DeliveryTimeline {
  status: string
  time: string
  description: string
  completed: boolean
}

const initialDeliveryData: DeliveryItem[] = [
  {
    id: "DLV-501",
    order: "ORD-1001",
    customer: "Anita Sharma",
    customerPhone: "+91 98765 43210",
    customerAddress: "123 Main St, Banjara Hills, Hyderabad, Telangana 500034",
    customerImage: "https://picsum.photos/seed/anita/200/200.jpg",
    partner: "BlueDart Express",
    partnerPhone: "+91 98765 54321",
    status: "Picked Up",
    payment: "Paid",
    amount: "₹1,240",
    estimatedDelivery: "Jan 25, 2026",
    pickupTime: "Jan 24, 2026 - 10:30 AM",
    trackingNumber: "BD123456789",
    deliveryPerson: "Raj Kumar",
    notes: "Customer requested morning delivery",
    images: [
      "https://picsum.photos/seed/delivery1/400/300.jpg",
      "https://picsum.photos/seed/delivery2/400/300.jpg",
      "https://picsum.photos/seed/delivery3/400/300.jpg",
      "https://picsum.photos/seed/delivery4/400/300.jpg"
    ]
  },
  {
    id: "DLV-502",
    order: "ORD-1002",
    customer: "Rahul Verma",
    customerPhone: "+91 87654 32109",
    customerAddress: "456 Oak Ave, Jubilee Hills, Hyderabad, Telangana 500033",
    customerImage: "https://picsum.photos/seed/rahul/200/200.jpg",
    partner: "Delhivery",
    partnerPhone: "+91 87654 21098",
    status: "In Transit",
    payment: "COD",
    amount: "₹890",
    estimatedDelivery: "Jan 26, 2026",
    pickupTime: "Jan 24, 2026 - 2:15 PM",
    trackingNumber: "DH987654321",
    deliveryPerson: "Amit Singh",
    notes: "Handle with care - fragile items",
    images: [
      "https://picsum.photos/seed/delivery5/400/300.jpg",
      "https://picsum.photos/seed/delivery6/400/300.jpg",
      "https://picsum.photos/seed/delivery7/400/300.jpg",
      "https://picsum.photos/seed/delivery8/400/300.jpg"
    ]
  },
  {
    id: "DLV-503",
    order: "ORD-1003",
    customer: "Priya Nair",
    customerPhone: "+91 76543 21098",
    customerAddress: "789 Pine Rd, Gachibowli, Hyderabad, Telangana 500032",
    customerImage: "https://picsum.photos/seed/priya/200/200.jpg",
    partner: "DTDC",
    partnerPhone: "+91 76543 10987",
    status: "Out for Delivery",
    payment: "Paid",
    amount: "₹2,450",
    estimatedDelivery: "Jan 25, 2026",
    pickupTime: "Jan 24, 2026 - 11:45 AM",
    actualDelivery: "Jan 25, 2026 - 4:30 PM",
    trackingNumber: "DT456789123",
    deliveryPerson: "Sanjay Kumar",
    notes: "Premium delivery requested",
    images: [
      "https://picsum.photos/seed/delivery9/400/300.jpg",
      "https://picsum.photos/seed/delivery10/400/300.jpg",
      "https://picsum.photos/seed/delivery11/400/300.jpg",
      "https://picsum.photos/seed/delivery12/400/300.jpg"
    ]
  },
  {
    id: "DLV-504",
    order: "ORD-1004",
    customer: "Sunita Rao",
    customerPhone: "+91 65432 19876",
    customerAddress: "321 Elm St, Kukatpally, Hyderabad, Telangana 500045",
    customerImage: "https://picsum.photos/seed/sunita/200/200.jpg",
    partner: "Ecom Express",
    partnerPhone: "+91 65432 54321",
    status: "Delivered",
    payment: "Paid",
    amount: "₹1,680",
    estimatedDelivery: "Jan 26, 2026",
    pickupTime: "Jan 25, 2026 - 9:00 AM",
    actualDelivery: "Jan 26, 2026 - 3:15 PM",
    trackingNumber: "EC789456123",
    deliveryPerson: "Vikram Singh",
    notes: "Delivered successfully",
    images: [
      "https://picsum.photos/seed/delivery13/400/300.jpg",
      "https://picsum.photos/seed/delivery14/400/300.jpg",
      "https://picsum.photos/seed/delivery15/400/300.jpg",
      "https://picsum.photos/seed/delivery16/400/300.jpg"
    ]
  },
  {
    id: "DLV-505",
    order: "ORD-1005",
    customer: "Divya Patel",
    customerPhone: "+91 54321 09876",
    customerAddress: "654 Maple Dr, Kondapur, Hyderabad, Telangana 500084",
    customerImage: "https://picsum.photos/seed/divya/200/200.jpg",
    partner: "FedEx",
    partnerPhone: "+91 54321 09865",
    status: "Pending Approval",
    payment: "COD",
    amount: "₹1,850",
    estimatedDelivery: "Jan 27, 2026",
    trackingNumber: "FX567890123",
    notes: "New customer - first order"
  }
]

const getStatusColor = (status: string) => {
  switch(status) {
    case "Delivered": return "text-green-600 bg-green-100 border-green-200"
    case "Out for Delivery": return "text-blue-600 bg-blue-100 border-blue-200"
    case "In Transit": return "text-purple-600 bg-purple-100 border-purple-200"
    case "Picked Up": return "text-orange-600 bg-orange-100 border-orange-200"
    case "Processing": return "text-yellow-600 bg-yellow-100 border-yellow-200"
    case "Pending Approval": return "text-gray-600 bg-gray-100 border-gray-200"
    case "Cancelled": return "text-red-600 bg-red-100 border-red-200"
    default: return "text-gray-600 bg-gray-100 border-gray-200"
  }
}

const getStatusIcon = (status: string) => {
  switch(status) {
    case "Delivered": return <CheckCircle className="w-4 h-4" />
    case "Out for Delivery": return <Truck className="w-4 h-4" />
    case "In Transit": return <Package className="w-4 h-4" />
    case "Picked Up": return <Box className="w-4 h-4" />
    case "Processing": return <RefreshCw className="w-4 h-4" />
    case "Pending Approval": return <Clock className="w-4 h-4" />
    case "Cancelled": return <X className="w-4 h-4" />
    default: return <Clock className="w-4 h-4" />
  }
}

const getDeliveryTimeline = (delivery: DeliveryItem): DeliveryTimeline[] => {
  const timeline: DeliveryTimeline[] = [
    {
      status: "Order Placed",
      time: delivery.actualDelivery ? "Jan 23, 2026 - 8:00 AM" : "Jan 24, 2026 - 9:00 AM",
      description: "Order successfully placed and payment confirmed",
      completed: true
    }
  ]

  if (delivery.status === "Pending Approval") {
    return timeline
  }

  timeline.push({
    status: "Order Approved",
    time: "Jan 24, 2026 - 10:00 AM",
    description: "Order approved and assigned to delivery partner",
    completed: ["Processing", "Picked Up", "In Transit", "Out for Delivery", "Delivered"].includes(delivery.status)
  })

  if (["Pending Approval", "Processing"].includes(delivery.status)) {
    return timeline
  }

  timeline.push({
    status: "Package Picked Up",
    time: delivery.pickupTime || "Jan 24, 2026 - 11:00 AM",
    description: `Package picked up by ${delivery.deliveryPerson || 'delivery person'}`,
    completed: ["Picked Up", "In Transit", "Out for Delivery", "Delivered"].includes(delivery.status)
  })

  if (["Pending Approval", "Processing", "Picked Up"].includes(delivery.status)) {
    return timeline
  }

  timeline.push({
    status: "In Transit",
    time: "Jan 24, 2026 - 2:00 PM",
    description: "Package is in transit to delivery location",
    completed: ["In Transit", "Out for Delivery", "Delivered"].includes(delivery.status)
  })

  if (["Pending Approval", "Processing", "Picked Up", "In Transit"].includes(delivery.status)) {
    return timeline
  }

  timeline.push({
    status: "Out for Delivery",
    time: delivery.actualDelivery ? "Jan 25, 2026 - 3:30 PM" : "Jan 25, 2026 - 4:00 PM",
    description: `Package out for delivery with ${delivery.deliveryPerson || 'delivery person'}`,
    completed: ["Out for Delivery", "Delivered"].includes(delivery.status)
  })

  if (["Pending Approval", "Processing", "Picked Up", "In Transit", "Out for Delivery"].includes(delivery.status)) {
    return timeline
  }

  timeline.push({
    status: "Delivered",
    time: delivery.actualDelivery || "Jan 25, 2026 - 4:30 PM",
    description: "Package successfully delivered to customer",
    completed: delivery.status === "Delivered"
  })

  return timeline
}

export default function DeliveryManagement() {
  const [deliveryData, setDeliveryData] = useState(initialDeliveryData)
  const [selectedDelivery, setSelectedDelivery] = useState<DeliveryItem | null>(null)
  const [showTimeline, setShowTimeline] = useState(false)

  const updateStatus = (id: string, newStatus: DeliveryItem['status']) => {
    setDeliveryData((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: newStatus } : item
      )
    )
  }

  const openTimeline = (delivery: DeliveryItem) => {
    setSelectedDelivery(delivery)
    setShowTimeline(true)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold">
          Delivery Management
        </h1>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            Total Deliveries: {deliveryData.length}
          </span>
          <span className="text-sm text-green-600">
            Active: {deliveryData.filter(d => !["Delivered", "Cancelled"].includes(d.status)).length}
          </span>
        </div>
      </div>

      {/* Delivery Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {deliveryData.map((delivery) => (
          <div
            key={delivery.id}
            className="bg-card border border-border rounded-xl p-5 space-y-4 shadow-sm hover:shadow-md transition-shadow"
          >
            {/* Header */}
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-lg">{delivery.id}</h3>
                <p className="text-xs text-muted-foreground">Order: {delivery.order}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(delivery.status)}`}>
                <div className="flex items-center gap-1">
                  {getStatusIcon(delivery.status)}
                  <span>{delivery.status}</span>
                </div>
              </span>
            </div>

            {/* Customer Info */}
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-border">
                  <img 
                    src={delivery.customerImage} 
                    alt={delivery.customer}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = `https://picsum.photos/seed/${delivery.customer.toLowerCase()}/200/200.jpg`;
                    }}
                  />
                </div>
                <div>
                  <p className="font-medium text-sm">{delivery.customer}</p>
                  <p className="text-xs text-muted-foreground">{delivery.customerPhone}</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
                <p className="text-xs text-muted-foreground line-clamp-2">{delivery.customerAddress}</p>
              </div>
            </div>

            {/* Delivery Images */}
            {delivery.images && delivery.images.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-muted-foreground" />
                  <h4 className="font-medium text-sm">Delivery Images</h4>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {delivery.images.slice(0, 4).map((image, index) => (
                    <div key={index} className="relative group cursor-pointer">
                      <img 
                        src={image} 
                        alt={`Delivery image ${index + 1}`}
                        className="w-full h-20 object-cover rounded-lg border border-border hover:border-primary transition-colors"
                        onClick={() => window.open(image, '_blank')}
                      />
                      <div className="absolute inset-0 bg-black/0-0 group-hover:bg-black/20 transition-colors rounded-lg flex items-center justify-center">
                        <Eye className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </div>
                  ))}
                </div>
                {delivery.images.length > 4 && (
                  <button className="text-xs text-primary hover:text-primary/80 font-medium">
                    +{delivery.images.length - 4} more images
                  </button>
                )}
              </div>
            )}

            {/* Delivery Partner Info */}
            <div className="bg-muted/30 rounded-lg p-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{delivery.partner}</span>
                <span className="text-xs text-muted-foreground">{delivery.partnerPhone}</span>
              </div>
              {delivery.deliveryPerson && (
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">{delivery.deliveryPerson}</span>
                </div>
              )}
            </div>

            {/* Order Details */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Amount:</span>
                <span className="font-bold text-lg">{delivery.amount}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Payment:</span>
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  delivery.payment === "Paid" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                }`}>
                  {delivery.payment}
                </span>
              </div>
              {delivery.trackingNumber && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Tracking:</span>
                  <span className="font-mono text-xs">{delivery.trackingNumber}</span>
                </div>
              )}
            </div>

            {/* Timeline Button */}
            <button
              onClick={() => openTimeline(delivery)}
              className="w-full flex items-center justify-center gap-2 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              <Eye className="w-4 h-4" />
              <span className="text-sm font-medium">View Timeline</span>
            </button>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-2">
              {delivery.status === "Pending Approval" && (
                <>
                  <button
                    onClick={() => updateStatus(delivery.id, "Processing")}
                    className="flex-1 px-3 py-2 text-xs bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => updateStatus(delivery.id, "Cancelled")}
                    className="flex-1 px-3 py-2 text-xs bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                  >
                    Cancel
                  </button>
                </>
              )}

              {delivery.status === "Processing" && (
                <button
                  onClick={() => updateStatus(delivery.id, "Picked Up")}
                  className="w-full px-3 py-2 text-xs bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors"
                >
                  Mark Picked Up
                </button>
              )}

              {delivery.status === "Picked Up" && (
                <button
                  onClick={() => updateStatus(delivery.id, "In Transit")}
                  className="w-full px-3 py-2 text-xs bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
                >
                  Mark In Transit
                </button>
              )}

              {delivery.status === "In Transit" && (
                <button
                  onClick={() => updateStatus(delivery.id, "Out for Delivery")}
                  className="w-full px-3 py-2 text-xs bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Out for Delivery
                </button>
              )}

              {delivery.status === "Out for Delivery" && (
                <button
                  onClick={() => updateStatus(delivery.id, "Delivered")}
                  className="w-full px-3 py-2 text-xs bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                >
                  Mark Delivered
                </button>
              )}

              {delivery.status === "Delivered" && (
                <div className="w-full text-center px-3 py-2 text-xs bg-green-100 text-green-700 rounded-md font-medium">
                  <CheckCircle className="w-4 h-4 inline mr-1" />
                  Delivered Successfully
                </div>
              )}

              {delivery.status === "Cancelled" && (
                <div className="w-full text-center px-3 py-2 text-xs bg-red-100 text-red-700 rounded-md font-medium">
                  <X className="w-4 h-4 inline mr-1" />
                  Order Cancelled
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Timeline Modal */}
      {showTimeline && selectedDelivery && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setShowTimeline(false)}
        >
          <div
            className="bg-white rounded-2xl w-full max-w-2xl max-h-[80vh] overflow-y-auto shadow-xl border border-gray-100"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold">{selectedDelivery.id}</h3>
                  <p className="text-blue-100">Delivery Timeline</p>
                </div>
                <button
                  onClick={() => setShowTimeline(false)}
                  className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors"
                >
                  <X className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Order Summary */}
              <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-4 border border-gray-200">
                <h4 className="font-bold text-gray-900 mb-3">Order Summary</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Customer:</p>
                    <p className="font-medium text-gray-900">{selectedDelivery.customer}</p>
                    <p className="text-gray-500">{selectedDelivery.customerPhone}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Delivery Partner:</p>
                    <p className="font-medium text-gray-900">{selectedDelivery.partner}</p>
                    <p className="text-gray-500">{selectedDelivery.deliveryPerson}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Amount:</p>
                    <p className="font-bold text-lg text-gray-900">{selectedDelivery.amount}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Payment:</p>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      selectedDelivery.payment === "Paid" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                    }`}>
                      {selectedDelivery.payment}
                    </span>
                  </div>
                </div>
              </div>

              {/* Delivery Timeline */}
              <div>
                <h4 className="font-bold text-gray-900 mb-4">Delivery Timeline</h4>
                <div className="space-y-4">
                  {getDeliveryTimeline(selectedDelivery).map((step, index) => (
                    <div key={step.status} className="flex gap-4">
                      {/* Timeline Line */}
                      <div className="flex flex-col items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          step.completed ? 'bg-green-600' : 'bg-gray-300'
                        }`}>
                          {step.completed ? (
                            <Check className="w-4 h-4 text-white" />
                          ) : (
                            <Clock className="w-4 h-4 text-white" />
                          )}
                        </div>
                        {index < getDeliveryTimeline(selectedDelivery).length - 1 && (
                          <div className={`w-0.5 h-12 ${
                            step.completed ? 'bg-green-600' : 'bg-gray-300'
                          }`} />
                        )}
                      </div>

                      {/* Step Content */}
                      <div className="flex-1 pb-4">
                        <div className="flex items-center justify-between mb-1">
                          <h5 className={`font-medium ${
                            step.completed ? 'text-gray-900' : 'text-gray-500'
                          }`}>
                            {step.status}
                          </h5>
                          <span className={`text-xs ${
                            step.completed ? 'text-gray-600' : 'text-gray-400'
                          }`}>
                            {step.time}
                          </span>
                        </div>
                        <p className={`text-sm ${
                          step.completed ? 'text-gray-700' : 'text-gray-500'
                        }`}>
                          {step.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Additional Info */}
              {selectedDelivery.notes && (
                <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-200">
                  <h4 className="font-bold text-gray-900 mb-2">Delivery Notes</h4>
                  <p className="text-sm text-gray-700">{selectedDelivery.notes}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}