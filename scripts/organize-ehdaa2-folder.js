import fs from "fs";
import path from "path";

const ehdaa2Dir = "C:\\Users\\RAMY\\Desktop\\ehdaa2";

const CATEGORY_MAP = {
  "Body Care": [
    { orig: "00328871-3b1d-4f37-9761-aef278c5ee3b.jpg", newName: "Tesori d'Oriente - Body Butter Lotus Flower 450ml.jpg" },
    { orig: "0b9e83d2-6d8c-4198-9542-f1a869301b11.jpg", newName: "Eve Midnight - Perfumed Shower Gel 500ml.jpg" },
    { orig: "60656db2-8f53-473c-b28d-7dd3aa8f0ace.jpg", newName: "Ronza - Body Butter Warm Night.jpg" },
    { orig: "9808f9ea-d10e-43d7-b9fa-e934c6186fc8.jpg", newName: "Balea - 2-Klingen Einweg Rasierer 10 Stk.jpg" },
    { orig: "c37695a3-78ed-4539-b583-29fdb24f4512.jpg", newName: "Vaseline - Cocoa Radiant Body Oil 200ml.jpg" },
    { orig: "c4a34cc1-59f7-4f8a-b083-f7d5749f0e7b.jpg", newName: "Moroccan Black Soap - Blue Nila.jpg" },
    { orig: "cc0c1f7a-50f4-4ab3-a943-240acb1452b4.jpg", newName: "Rose Berry - Body Essence Oil 180g.jpg" },
    { orig: "d02d5fa2-d306-411c-b7c9-b6a617fff767.jpg", newName: "Tenzero - Turn On Body Brightening Cream 180ml.jpg" },
    { orig: "d03c42ca-3a5b-4319-b146-042e4b95230e.jpg", newName: "Ronza - Foot Stick Keratolytic Cream.jpg" },
    { orig: "f1382dba-f197-476f-b055-4b0929c17ec3.jpg", newName: "Rozy Honey - Bikini Butter.jpg" },
    { orig: "f1ed930a-b0ab-4780-82e5-3406d05ccecd.jpg", newName: "Moroccan Beldi Soap - Aker Fassi.jpg" },
  ],
  "Hair Care": [
    { orig: "0a6ca673-50ee-4c03-b616-a68cba815d98.jpg", newName: "Balea - Plex Care Serum 50ml.jpg" },
    { orig: "17188202-d478-4486-9143-484899fd10fa.jpg", newName: "Nascita - Wet & Dry Spiral Hair Brush.jpg" },
    { orig: "6590a83b-13be-4922-a8d3-784af17e5754.jpg", newName: "Bio Soft - Avocado Deep Conditioner 1000ml.jpg" },
    { orig: "93b8a3da-9bef-47b2-8a3a-de04ec037150.jpg", newName: "Balea - Keratin Repair Overnight Fluid.jpg" },
    { orig: "c6e09af3-8364-4cf3-9643-5395982bfef2.jpg", newName: "Mivolis - Haar Vital Biotin 60 Caps.jpg" },
    { orig: "c8c5794c-0ded-4af8-bd38-56bcbee967a3.jpg", newName: "Sesa - Ayurvedic Hair Oil 100ml.jpg" },
    { orig: "ceda1c14-ffbf-46d6-8559-e9ac42da9276.jpg", newName: "Langhaar Mädchen - Haaröl Intense Repair 100ml.jpg" },
    { orig: "e6402256-0689-4cd0-af9c-49f9efcb0649.jpg", newName: "Kesh King - Anti-Hairfall Shampoo Aloe Vera.jpg" },
    { orig: "efce2e0e-8295-40e5-8753-e02d916c3649.jpg", newName: "Balea - Aqua Hyaluron 3in1 Haarmaske.jpg" },
  ],
  "Skincare": [
    { orig: "2b2a83a5-c4ea-4c27-80b9-8c8467645608.jpg", newName: "Lebelage - Dr. CICA Cure Cream 70ml.jpg" },
    { orig: "3258d801-a35c-4383-9080-d817e0bf01e5.jpg", newName: "Biodegradable Dermaplaning Razors 6 Pcs.jpg" },
    { orig: "42547ad1-1978-49e5-a683-b5e77ba7baa2.jpg", newName: "Arencia - Vitamin C Booster Shot 20ml.jpg" },
    { orig: "444f7178-d91f-4709-8387-ab4a735cb592.jpg", newName: "Grace Day - Grape Fruit Peeling Gel 100ml.jpg" },
    { orig: "cb874b85-9a2f-4ddf-85d5-58a6802c816f.jpg", newName: "Balea - Hyaluron Handserum 100ml.jpg" },
    { orig: "d012e225-9c76-4597-b584-f1104001a375.jpg", newName: "Tenzero - Moisture Soothing Cica Gel 300ml.jpg" },
    { orig: "efb42250-5ba2-4096-b4a2-ed8895a26a7f.jpg", newName: "Kenta Bébé - Crème de Soin 50g.jpg" },
    { orig: "fe794c5a-f80a-405c-8009-ae93674c2bff.jpg", newName: "Tenzero - Perfect Brightening Tone-Up Cream 50g.jpg" },
  ],
  "Deodorants": [
    { orig: "22ad6b0f-afb9-4f73-807c-a91461d9b838.jpg", newName: "Balea Men - Golden Intense Bodyspray 24h.jpg" },
    { orig: "89126877-e30e-4f6e-9973-395f2d3569cd.jpg", newName: "ISANA - Deocreme mit Natron 50ml.jpg" },
    { orig: "9d46d820-773a-419d-9bc5-4010da193d5d.jpg", newName: "Balea Men - Extra Dry Anti-Transpirant Stick 72h.jpg" },
    { orig: "e43f4f0a-ccba-4531-8ca1-28cd18222718.jpg", newName: "ISANA - Deocreme mit frischem Duft 50ml.jpg" },
  ],
  "Fragrance": [
    { orig: "11284652-5a6d-4e81-8be4-10ed6749118f.jpg", newName: "Moatar Kiswat Al Kaaba 400ml.jpg" },
    { orig: "183d2a39-d741-43a2-96a3-1573d29488b3.jpg", newName: "Ameert Arab EX Parfum 30ml.jpg" },
    { orig: "295bebf7-28c4-4cc7-84b1-ba18fb1b68d3.jpg", newName: "Solo Collection - Water Parfum Musk Powder 100ml.jpg" },
    { orig: "a982173e-23ed-4a5a-bbe5-f664ce81799c.jpg", newName: "Moatar Al Rawda 400ml.jpg" },
    { orig: "b6453a89-c260-45bc-bdb8-d75170f8e132.jpg", newName: "Solo Collection - Water Parfum Musk Al Tahara 100ml.jpg" },
    { orig: "be5b0777-943f-49b8-887d-975dbcdb74b6.jpg", newName: "Billie Eilish - Eilish Eau de Parfum 100ml.jpg" },
    { orig: "cb941b26-bd98-49f6-8718-6fb322938a96.jpg", newName: "Solo Collection - Water Parfum Musk Vanilla 100ml.jpg" },
  ],
  "Makeup": [
    { orig: "7f45182c-bd9f-4f3e-8c5c-477ecb06a6f0.jpg", newName: "Rose Gold - Lip Oil.jpg" },
    { orig: "b3324421-f0cd-4882-96c4-6a3c6c37e5e0.jpg", newName: "Muge Leen - 12 Pcs Lip Set.jpg" },
    { orig: "d5173d1e-4055-495c-9d69-39b71668c472.jpg", newName: "Aloe Vera 99% - Soothing Magic Lip Balm.jpg" },
    { orig: "ef245358-e9ba-47b1-8181-8f5797dcc19b.jpg", newName: "Tenzero - Perfect Cover BB Cream 50g.jpg" },
    { orig: "f400b489-ae57-4659-9812-36cc4a16b42d.jpg", newName: "SHEGLAM - Tubing Tech Flake-Off Mascara.jpg" },
  ],
};

function organizeEhdaa2() {
  console.log("📁 Organizing ehdaa2 on Desktop into Category Folders...");

  for (const [category, files] of Object.entries(CATEGORY_MAP)) {
    const catFolderPath = path.join(ehdaa2Dir, category);
    if (!fs.existsSync(catFolderPath)) {
      fs.mkdirSync(catFolderPath, { recursive: true });
    }

    for (const item of files) {
      const srcPath = path.join(ehdaa2Dir, item.orig);
      const destPath = path.join(catFolderPath, item.newName);

      if (fs.existsSync(srcPath)) {
        fs.renameSync(srcPath, destPath);
        console.log(`✅ Moved: [${category}] ${item.newName}`);
      } else {
        console.warn(`⚠️ Warning: ${item.orig} not found`);
      }
    }
  }

  console.log("\n🎉 ehdaa2 folder successfully organized into 6 clean category subdirectories!\n");
}

organizeEhdaa2();
