import PDFCard from "@/components/pdf-card"

const sampleData = {
  pdfs: [
    { title: "Topología Tema 1", url: "https://youtube.com/", date: "12/1/2025", views: 100, img: "/image.png" },
    { title: "Topología Tema 2", url: "https://youtube.com/", date: "12/1/2025", views: 150, img: "/image.png" },
    { title: "Topología Tema 3", url: "https://youtube.com/", date: "12/1/2025", views: 200, img: "/image.png" },
    { title: "Topología Tema 4", url: "https://youtube.com/", date: "12/1/2025", views: 250, img: "/image.png" },
  ],
}

function WelcomePage() {
  return (
    <>
      <div className="p-8">
        <div className="bg-muted/50 rounded-xl w-full h-32" />
        <section className="mt-8">
          <h2 className="text-2xl font-bold">Últimos apuntes</h2>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {sampleData.pdfs.map((pdf, index) => (
              <PDFCard
                key={index}
                title={pdf.title}
                url={pdf.url}
                date={pdf.date}
                views={pdf.views}
                img={pdf.img}
              />
            ))}
          </div>
        </section>
      </div>
    </>
  )
}
export default WelcomePage


// <div className="flex flex-1 flex-col gap-4 p-4">
//         <div className="grid auto-rows-min gap-4 md:grid-cols-3">
//           <div className="bg-muted/50 aspect-video rounded-xl" />
//           <div className="bg-muted/50 aspect-video rounded-xl" />
//           <div className="bg-muted/50 aspect-video rounded-xl" />
//         </div>
//         <div className="bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min" />
//       </div>