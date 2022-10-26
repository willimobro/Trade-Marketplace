import SwiftUI
import Firebase

enum Route: Hashable    {
    case home
}

class Coordinator: ObservableObject {
    @Published var path = [Route]()
}

@main
struct Trade_Marketplace: App   {
    init()  {
        FirebaseApp.configure()
    }
    @StateObject var servercontrol = ServerControl()
    @StateObject var profileview = downloadprofileviewdata()
    @StateObject var a = downloadcompletedlistingsdata()
    @StateObject var b = downloadlistingsdata()
    @StateObject var c = downloadrecievedquotesdata()
    @StateObject var d = downloadSentQuotes()
    @StateObject var e = downloadWatchlist()
    @StateObject var f = downloadalljobs()
    @StateObject var g = UploadJob()
    @ObservedObject var coordinator = Coordinator()
    
    var body: some Scene    {
    WindowGroup {
        if #available(iOS 16.0, *) {
            NavigationStack(path: $coordinator.path){
                LandingControl()
                    .navigationDestination(for: Route.self) { route in
                        switch route {
                        case .home:
                            TabBar()
                        }
                    }
            }
            
            .environmentObject(coordinator)
            .environmentObject(servercontrol)
            .environmentObject(profileview)
            .environmentObject(a)
            .environmentObject(b)
            .environmentObject(c)
            .environmentObject(d)
            .environmentObject(e)
            .environmentObject(f)
            .environmentObject(g)
            
            
            
            
        } else {
            // Fallback on earlier versions
        }
    }
  }
}

// USER UID CODE
// user!.uid
// @EnvironmentObject var servercontrol: ServerControl
// servercontrol.text
// .onAppear { self.servercontrol.DownloadData(collection: "", document: "", field: "")
