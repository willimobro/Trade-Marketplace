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
        } else {
            // Fallback on earlier versions
        }
    }
  }
}
