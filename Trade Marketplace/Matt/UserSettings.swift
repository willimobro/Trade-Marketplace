
import SwiftUI

struct UserSettings: View {
    var body: some View {
        NavigationView {
            List {
                Section {
                    NavigationLink (destination: HomeView()) {
                        Label("Settings", systemImage: "gear")}
                    NavigationLink (destination: HomeView()) {
                        Label("Help", systemImage: "questionmark.circle")}
                    NavigationLink (destination: HomeView()) {
                        Label("Billing", systemImage: "creditcard")}
                    NavigationLink (destination: HomeView()) {
                        Label("Disput Centre", systemImage: "bubble.left.and.exclamationmark.bubble.right")}
                    
                }
                Section {
                    NavigationLink (destination: HomeView()) {
                        Label("Manual Address", systemImage: "location.circle") }
                }
                Section {
                    Text("Business Account Info")
                        .fontWeight(.semibold)
                    NavigationLink (destination: HomeView()) {
                        Label("Business Account", systemImage: "gear") }
                    NavigationLink (destination: HomeView()) {
                        Label("Manual Address", systemImage: "gear") }
                }
            }
           
        }
    }
    
}


struct UserSettings_Previews: PreviewProvider {
    static var previews: some View {
        UserSettings()
    }
}
