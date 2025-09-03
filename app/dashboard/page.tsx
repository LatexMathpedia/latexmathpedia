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
      <div className="flex flex-1 flex-col gap-4 p-4">
        <div className="grid auto-rows-min gap-4 md:grid-cols-3">
          <div className="bg-muted/50 aspect-video rounded-xl" />
          <div className="bg-muted/50 aspect-video rounded-xl" />
          <div className="bg-muted/50 aspect-video rounded-xl" />
        </div>
        <div className="bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min" />
      </div>
    </>
  )
}
export default WelcomePage