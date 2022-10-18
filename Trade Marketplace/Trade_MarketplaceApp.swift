import SwiftUI
import Firebase

@main
struct Trade_Marketplace: App   {
    init()  {
        FirebaseApp.configure()
    }
    @StateObject var logintrue = UserLoggedIn()
    var body: some Scene    {
    WindowGroup {
        LandingControl()
            .environmentObject(UserLoggedIn())
    }
  }
}
