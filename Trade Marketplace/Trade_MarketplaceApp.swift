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
            }.environmentObject(coordinator)
            .environmentObject(servercontrol)
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
