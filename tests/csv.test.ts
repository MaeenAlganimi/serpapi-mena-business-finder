import { listingsToCsv } from "@/lib/csv";
import type { BusinessListing } from "@/lib/types";
import { describe, expect, it } from "vitest";

const place: BusinessListing = {
  name: 'هيل الميناء',
  type: "مقهى",
  rating: 4.6,
  reviews: 214,
  address: "14 زقاق الميناء، طرابلس",
  phone: "+218 91 000 1101",
  hours: "Open, until 11 PM",
  link: "https://mina-cardamom.example",
};

describe("listingsToCsv", () => {
  it("writes a UTF-8 BOM, translated headers, and escaped cells", () => {
    const csv = listingsToCsv([place], {
      name: "الاسم",
      type: "النوع",
      rating: "التقييم",
      reviews: "المراجعات",
      address: "العنوان",
      phone: "الهاتف",
      hours: "ساعات العمل",
      link: "الرابط",
    });

    expect(csv.startsWith("\uFEFF")).toBe(true);
    expect(csv).toContain("الاسم,النوع,التقييم,المراجعات,العنوان,الهاتف,ساعات العمل,الرابط");
    expect(csv).toContain('"Open, until 11 PM"');
    expect(csv).toContain("هيل الميناء");
  });

  it("quotes embedded quotes and blank missing numbers", () => {
    const csv = listingsToCsv(
      [{ ...place, name: 'Cafe "Lantern"', rating: null, reviews: null, hours: "line\nbreak" }],
      {
        name: "Name",
        type: "Type",
        rating: "Rating",
        reviews: "Reviews",
        address: "Address",
        phone: "Phone",
        hours: "Hours",
        link: "Link",
      },
    );

    expect(csv).toContain('"Cafe ""Lantern"""');
    expect(csv).toContain('"line\nbreak"');
    const dataRow = csv.split("\r\n")[1] ?? "";
    expect(dataRow.split(",")[2]).toBe("");
    expect(dataRow.split(",")[3]).toBe("");
  });
});
