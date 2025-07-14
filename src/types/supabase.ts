export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
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
      coupons: {
        Row: {
          amount: number
          code: string
          id: string
          image_url: string | null
        }
        Insert: {
          amount: number
          code: string
          id: string
          image_url?: string | null
        }
        Update: {
          amount?: number
          code?: string
          id?: string
          image_url?: string | null
        }
        Relationships: []
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
          used_coupon_code: string[] | null
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
          used_coupon_code?: string[] | null
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
          used_coupon_code?: string[] | null
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
          addresses: Json | null
          avatar: string | null
          coupons: string[] | null
          created_at: string
          email: string | null
          id: string
          name: string | null
          nickname: string | null
          phoneNumber: string | null
          reportedUserId: string[] | null
          shippingRequest: string | null
        }
        Insert: {
          addresses?: Json | null
          avatar?: string | null
          coupons?: string[] | null
          created_at?: string
          email?: string | null
          id: string
          name?: string | null
          nickname?: string | null
          phoneNumber?: string | null
          reportedUserId?: string[] | null
          shippingRequest?: string | null
        }
        Update: {
          addresses?: Json | null
          avatar?: string | null
          coupons?: string[] | null
          created_at?: string
          email?: string | null
          id?: string
          name?: string | null
          nickname?: string | null
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
        Args: { region: string; lim: number }
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
      users_addresses: "{[key: string]: any}"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      users_addresses: ["{[key: string]: any}"],
    },
  },
} as const
