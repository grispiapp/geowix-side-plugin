export type ShipmentTrackingRequest = {
  apikey: string;
  tracking_code: string;
};

export type ShipmentTrackingResponse = {
  response_val: number;
  response_text: string;
  tracking_code: string;
  tracking_url: string;
  shipment_status_code: string;
  shipment_status: string;
  document_date: string;
  receiver_info: string;
  plate: string;
  driver: string;
  driver_telephone: string;
  slot: string;
  warehouse_telephone: string;
  sender_name: string;
  sender_telephone: string;
  sender_email: string;
  sender_address: string;
  receiver_name: string;
  receiver_telephone: string;
  receiver_email: string;
  receiver_address: string;
  receiver_city: string;
  receiver_district: string;
  receiver_county: string;
  receiver_latitude: string;
  receiver_longitude: string;
  logs: ShipmentLog[];
  files: File[];
};

export type ShipmentLog = {
  shipment_code: string;
  package_id: string;
  package_barcode: string;
  shipment_status_code: string;
  shipment_status: string;
  document_date: string;
  receiver_name: string | null;
  location_name: string;
  location_code: string;
  location_phone: string;
  location_city: string;
  location_county: string;
  notes: string;
  requested_delivery_date: string;
  neighbor_name: string;
  neighbor_phone: string;
  package_count: number;
  kg_desi: number;
  undelivered_reason: string | null;
  undelivered_reason_code: number | null;
};

export type GetOrdersRequest = {
  apikey: string;
  prm: string;
};

export type GetOrdersResponse = {
  response_val: number;
  response_text: string;
  datav: Order[];
};

export type Order = {
  company_name: string;
  order_code: string;
  tracking_code: string;
  date: string;
};

type File = {
  file: string;
  create_date: string;
  create_user: string;
};
