// orderService.interface.ts
export interface Order {
    name: string;
    last_name: string;
    phone: string;
    email: string;
    quantity: number;
    bed_name: string;
  }
  
  export interface OrderCreate {
    name: string;
    last_name: string;
    phone: string;
    email: string;
    quantity: number;
    bed_name: string;
  }
  
  export interface OrderResponse {
    message: string;
  }