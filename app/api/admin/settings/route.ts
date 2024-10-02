import { dbConnect } from "@/lib/dbConnect";
import CompanyInfo from "@/models/CompanyInfo";
import { ICompanyInfo } from "@/types";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  await dbConnect();

  const body = (await req.json()) as ICompanyInfo;
  try {
    // Save to db
    const companyInfo = await new CompanyInfo(body).save();

    return NextResponse.json(
      { data: companyInfo, message: "Saved" },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json({ err }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  await dbConnect();

  const body = await req.json();
  try {
    
    // Save to db
    await CompanyInfo.findByIdAndUpdate(body.id, {
      logo: body.logo,
      category: body.category,
      description: body.description,
      name: body.name,
    });

    return NextResponse.json(
      { data: body, message: "updated" },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json({ err }, { status: 500 });
  }
}

export async function GET() {
  await dbConnect();

  try {
    const companyInfo = await CompanyInfo.find();

    return NextResponse.json({ data: companyInfo }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ err }, { status: 500 });
  }
}
