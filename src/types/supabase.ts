export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      cart: {
        Row: {
          count: number | null
          created_at: string
          description: string | null
          discountRate: number | null
          id: number
          image: string | null
          product_id: string | null
          product_name: string | null
          product_price: number | null
          user_id: string | null
        }
        Insert: {
          count?: number | null
          created_at?: string
          description?: string | null
          discountRate?: number | null
          id?: number
          image?: string | null
          product_id?: string | null
          product_name?: string | null
          product_price?: number | null
          user_id?: string | null
        }
        Update: {
          count?: number | null
          created_at?: string
          description?: string | null
          discountRate?: number | null
          id?: number
          image?: string | null
          product_id?: string | null
          product_name?: string | null
          product_price?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cart_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "local_food"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "cart_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      chat: {
        Row: {
          content: string | null
          created_at: string
          id: number
          isReported: boolean | null
          room_id: string
          user_id: string | null
        }
        Insert: {
          content?: string | null
          created_at?: string
          id?: number
          isReported?: boolean | null
          room_id: string
          user_id?: string | null
        }
        Update: {
          content?: string | null
          created_at?: string
          id?: number
          isReported?: boolean | null
          room_id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "chat_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms"
            referencedColumns: ["room_id"]
          },
          {
            foreignKeyName: "chat_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      comments: {
        Row: {
          content: string | null
          created_at: string
          id: number
          market_id: number | null
          user_id: string | null
        }
        Insert: {
          content?: string | null
          created_at?: string
          id?: number
          market_id?: number | null
          user_id?: string | null
        }
        Update: {
          content?: string | null
          created_at?: string
          id?: number
          market_id?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "comments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      likes: {
        Row: {
          created_at: string
          id: number
          market_id: number
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          market_id: number
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          market_id?: number
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "likes_market_id_fkey"
            columns: ["market_id"]
            isOneToOne: false
            referencedRelation: "markets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "likes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      local_food: {
        Row: {
          category: string | null
          count: number | null
          created_at: string
          description: string | null
          discountRate: number | null
          food_image: string | null
          food_name: string | null
          location: string | null
          price: number | null
          product_id: string
          title_image: string[] | null
        }
        Insert: {
          category?: string | null
          count?: number | null
          created_at?: string
          description?: string | null
          discountRate?: number | null
          food_image?: string | null
          food_name?: string | null
          location?: string | null
          price?: number | null
          product_id?: string
          title_image?: string[] | null
        }
        Update: {
          category?: string | null
          count?: number | null
          created_at?: string
          description?: string | null
          discountRate?: number | null
          food_image?: string | null
          food_name?: string | null
          location?: string | null
          price?: number | null
          product_id?: string
          title_image?: string[] | null
        }
        Relationships: []
      }
      markets: {
        Row: {
          id: number
          고객휴게실_보유여부: string | null
          대권역: string | null
          도로명주소: string | null
          물품보관함_보유여부: string | null
          소권역: string | null
          시도: string | null
          시장명: string | null
          시장전용고객주차장_보유여부: string | null
          이미지: string[] | null
        }
        Insert: {
          id?: never
          고객휴게실_보유여부?: string | null
          대권역?: string | null
          도로명주소?: string | null
          물품보관함_보유여부?: string | null
          소권역?: string | null
          시도?: string | null
          시장명?: string | null
          시장전용고객주차장_보유여부?: string | null
          이미지?: string[] | null
        }
        Update: {
          id?: never
          고객휴게실_보유여부?: string | null
          대권역?: string | null
          도로명주소?: string | null
          물품보관함_보유여부?: string | null
          소권역?: string | null
          시도?: string | null
          시장명?: string | null
          시장전용고객주차장_보유여부?: string | null
          이미지?: string[] | null
        }
        Relationships: []
      }
      orderd_list: {
        Row: {
          amount: number | null
          created_at: string | null
          id: string
          is_CouponApplied: boolean | null
          order_name: string | null
          pay_provider: string | null
          payment_date: string | null
          payment_id: string
          phone_number: string | null
          price: number | null
          products: Json | null
          shipping_request: string | null
          status: string | null
          user_email: string | null
          user_id: string | null
          user_name: string | null
        }
        Insert: {
          amount?: number | null
          created_at?: string | null
          id?: string
          is_CouponApplied?: boolean | null
          order_name?: string | null
          pay_provider?: string | null
          payment_date?: string | null
          payment_id: string
          phone_number?: string | null
          price?: number | null
          products?: Json | null
          shipping_request?: string | null
          status?: string | null
          user_email?: string | null
          user_id?: string | null
          user_name?: string | null
        }
        Update: {
          amount?: number | null
          created_at?: string | null
          id?: string
          is_CouponApplied?: boolean | null
          order_name?: string | null
          pay_provider?: string | null
          payment_date?: string | null
          payment_id?: string
          phone_number?: string | null
          price?: number | null
          products?: Json | null
          shipping_request?: string | null
          status?: string | null
          user_email?: string | null
          user_id?: string | null
          user_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "order_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      reports: {
        Row: {
          created_at: string
          id: number
          reportedContent: string | null
          reportedDetailContent: string | null
          reportedUserId: string | null
          reporterId: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          reportedContent?: string | null
          reportedDetailContent?: string | null
          reportedUserId?: string | null
          reporterId?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          reportedContent?: string | null
          reportedDetailContent?: string | null
          reportedUserId?: string | null
          reporterId?: string | null
        }
        Relationships: []
      }
      reviews: {
        Row: {
          content: string | null
          created_at: string
          payment_id: string | null
          product_id: string | null
          rating: number | null
          review_id: string
          user_id: string | null
        }
        Insert: {
          content?: string | null
          created_at?: string
          payment_id?: string | null
          product_id?: string | null
          rating?: number | null
          review_id?: string
          user_id?: string | null
        }
        Update: {
          content?: string | null
          created_at?: string
          payment_id?: string | null
          product_id?: string | null
          rating?: number | null
          review_id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reviews_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "local_food"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "reviews_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      rooms: {
        Row: {
          chat_description: string
          chat_name: string
          created_at: string
          created_user_id: string
          id: string
          room_id: string
          room_img: string
        }
        Insert: {
          chat_description: string
          chat_name: string
          created_at?: string
          created_user_id?: string
          id: string
          room_id: string
          room_img: string
        }
        Update: {
          chat_description?: string
          chat_name?: string
          created_at?: string
          created_user_id?: string
          id?: string
          room_id?: string
          room_img?: string
        }
        Relationships: [
          {
            foreignKeyName: "rooms_created_user_id_fkey"
            columns: ["created_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          addresses: {[key: string] : any}
          avatar: string | null
          coupon: string | null
          created_at: string
          defaultAddress: Json | null
          email: string | null
          id: string
          name: string | null
          nickname: string | null
          password: string | null
          phoneNumber: string | null
          reportedUserId: string[] | null
          shippingRequest: string | null
        }
        Insert: {
          addresses?: Json | null
          avatar?: string | null
          coupon?: string | null
          created_at?: string
          defaultAddress?: Json | null
          email?: string | null
          id: string
          name?: string | null
          nickname?: string | null
          password?: string | null
          phoneNumber?: string | null
          reportedUserId?: string[] | null
          shippingRequest?: string | null
        }
        Update: {
          addresses?: Json | null
          avatar?: string | null
          coupon?: string | null
          created_at?: string
          defaultAddress?: Json | null
          email?: string | null
          id?: string
          name?: string | null
          nickname?: string | null
          password?: string | null
          phoneNumber?: string | null
          reportedUserId?: string[] | null
          shippingRequest?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_random_markets: {
        Args: {
          region: string
          lim: number
        }
        Returns: {
          id: number
          고객휴게실_보유여부: string | null
          대권역: string | null
          도로명주소: string | null
          물품보관함_보유여부: string | null
          소권역: string | null
          시도: string | null
          시장명: string | null
          시장전용고객주차장_보유여부: string | null
          이미지: string[] | null
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
