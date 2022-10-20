//stuff
import SwiftUI

struct UserSettings: View {
    @AppStorage("isLogged") var isLogged = false
    @Environment(\.presentationMode) var presentationMode
    var body: some View {
        NavigationView {
            List {
                Section {
//                    NavigationLink (destination: UnderConstructionPage()) {
//                        Label("Settings", systemImage: "gear")}
//                    NavigationLink (destination: UnderConstructionPage()) {
//                        Label("Help", systemImage: "questionmark.circle")}
//                    NavigationLink (destination: UnderConstructionPage()) {
//                        Label("Billing", systemImage: "creditcard")}
//                    NavigationLink (destination: UnderConstructionPage()) {
//                        Label("Dispute Centre", systemImage: "bubble.left.and.exclamationmark.bubble.right")}
//
//                }
//                Section {
//                    NavigationLink (destination: UnderConstructionPage()) {
//                        Label("say bruh if u epic", systemImage: "location.circle") }
//                }
//                Section {
//                    Text("Business Account Info")
//                        .fontWeight(.semibold)
//                    NavigationLink (destination: UnderConstructionPage()) {
//                        Label("Business Account", systemImage: "gear") }
//                    NavigationLink (destination: UnderConstructionPage()) {
//                        Label("Verify Account", systemImage: "person.text.rectangle") }
//                }
//                Section {
//                    NavigationLink (destination: AboutTradeMarketplace()) {
//                        Label("About", systemImage: "info.circle") }
//                    NavigationLink (destination: UnderConstructionPage()) {
//                        Label("Terms and Conditions", systemImage: "doc.text.magnifyingglass") }
                }
                
                    Section {
                        Button {} label: {
                            Text("Sign out")
                                .frame(maxWidth: .infinity)
                            
                                .tint(.red)
                                .onTapGesture {
                                    isLogged = false
                                    presentationMode.wrappedValue.dismiss()
                                }
                        }
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
