import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";
type ParamsType = {
    params: { marketId: number };
  }
  type userCommentType = {
    id: string;
    market_id: number;
    user_id: string;
    content: string;
    created_at: string;
    users: {
      avatar: string;
      nickname: string;
    }
  }

// 댓글 작성
export async function POST(request: Request, {params}: ParamsType) {
    const supabase = createClient()

    const {marketId} = params
    const newComment = await request.json() 
    const { comment,  userId } = newComment
    if (!comment || !marketId || !userId) {
        return NextResponse.json({ error: '댓글 등록이 실패했습니다' }, { status: 400 })
    }
    const {data, error} = await supabase.from('comments').insert([
        {
        content: comment,
        market_id: marketId,
        user_id: userId
        }
    ])
    
    if (error) {
        throw error
    }
    return NextResponse.json(data)
}

// 댓글 불러오기
export async function GET(request: Request, {params}: ParamsType) {
    const supabase = createClient()
    
    const {marketId} = params
    const {data, error} = await supabase.from('comments').select(`
        id,
        market_id,
        user_id,
        content,
        created_at,
        users (
          nickname,
          avatar
        )`).eq('market_id', marketId ).order('created_at', {ascending : false})

    if (error) {
        return NextResponse.json({ error: '댓글 불러오는 걸 실패했습니다' }, { status: 400 })
    }
    return NextResponse.json(data)
}

// 댓글 삭제하기
export async function DELETE(request: Request, {params}: ParamsType) {
    const supabase = createClient()

    const commentId = await request.json()
    const {data, error} = await supabase.from('comments').delete().eq('id', commentId)

    if(error) {
        return NextResponse.json({ error: '댓글 삭제를 실패했습니다' }, { status: 400 })
    }
    return NextResponse.json(data)
}

// 댓글 수정하기
export async function PATCH(request: Request, {params}: ParamsType) {
    const supabase = createClient()

    const {comment, commentId} = await request.json()

    const {data, error} = await supabase.from('comments').update({
        content: comment
    }).eq('id', commentId)

    if(error) {
        return NextResponse.json(error)
    }
    return NextResponse.json(data)
}