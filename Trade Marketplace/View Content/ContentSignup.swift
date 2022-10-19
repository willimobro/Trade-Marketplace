
import SwiftUI
import FirebaseAuth

struct ContentSignup: View {
    @StateObject private var vm = ServerControl()
    @Binding var selectedbutton : Views
    @State var firstname = ""
    @State var lastname = ""
    @State var email = ""
    @State var password = ""
    var body: some View {
        ZStack{
            Rectangle()
                .foregroundColor(.white)
                .ignoresSafeArea()
            
            
            Spacer()
            VStack(spacing: 20) {
                Text("Create \nAccount")
                    .font(.custom("Alien", size: 36))
                    .foregroundColor(.primary)
                    .multilineTextAlignment(.leading)
                    .frame(width: 321, height: 90, alignment: .bottomLeading)
                    
                ZStack{
                    TextField("First name", text: $firstname)
                        .textContentType(.emailAddress)
                        .keyboardType(.emailAddress)
                        .autocapitalization(.none)
                        .disableAutocorrection(true)
                        .frame(width: 301, height: 45, alignment: .center)
                        .shadow(color: .secondary, radius: 4, x: 0, y: 0)
                        
                }
                        .frame(width: 321, height: 55, alignment: .center)
                ZStack{
                TextField("Last name", text: $lastname)
                    .textContentType(.emailAddress)
                    .keyboardType(.emailAddress)
                    .autocapitalization(.none)
                    .disableAutocorrection(true)
                    .frame(width: 301, height: 45, alignment: .center)
                    .shadow(color: .secondary, radius: 4, x: 0, y: 0)
                    
            }
                ZStack{
                    TextField("Email", text: $email)
                        .textContentType(.password)
                        .autocapitalization(.none)
                        .disableAutocorrection(true)
                        .frame(width: 301, height: 45, alignment: .center)
                        .shadow(color: .secondary, radius: 4, x: 0, y: 0)
                        
                        
                }
                        .frame(width: 321, height: 55, alignment: .center)
                ZStack{
                    TextField("Password", text: $password)
                        .textContentType(.emailAddress)
                        .keyboardType(.emailAddress)
                        .autocapitalization(.none)
                        .disableAutocorrection(true)
                        .frame(width: 301, height: 45, alignment: .center)
                        .shadow(color: .secondary, radius: 4, x: 0, y: 0)
                        
                }
                        .frame(width: 321, height: 55, alignment: .center)
                
                Button("Create Account") {
                    vm.register(email: email, password: password, firstnamef: firstname, lastnamef: lastname) { result in
                        selectedbutton = .home
                    }
                }
                    .frame(width: 321, height: 55, alignment: .center)
                    .background(Color("ButtonColorSL"))
                    .cornerRadius(15)
                    .foregroundColor(.white)
                
            Divider()
                    .frame(width: 321)
                
            Button("Login") {
                selectedbutton = .login
                    
            }
                .frame(width: 321, height: 55, alignment: .center)
                .background(Color("ButtonColorSL"))
                .cornerRadius(15)
                .foregroundColor(.white)
            }
                .padding(20)
            }
    .padding(.top, 210)
}
}

