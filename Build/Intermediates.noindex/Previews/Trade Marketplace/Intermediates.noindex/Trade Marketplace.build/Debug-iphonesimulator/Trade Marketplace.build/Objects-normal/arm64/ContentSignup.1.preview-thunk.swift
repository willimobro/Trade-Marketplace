@_private(sourceFile: "ContentSignup.swift") import Trade_Marketplace
import FirebaseAuth
import SwiftUI
import SwiftUI

extension ContentSignup {
    @_dynamicReplacement(for: body) private var __preview__body: some View {
        #sourceLocation(file: "/Applications/Trade-Marketplace/Trade Marketplace/View Content/ContentSignup.swift", line: 12)
        ZStack{
            Rectangle()
                .foregroundColor(.white)
                .ignoresSafeArea()
            
            
            Spacer()
            VStack(spacing: __designTimeInteger("#17945.[2].[5].property.[0].[0].arg[0].value.[2].arg[0].value", fallback: 20)) {
                Text(__designTimeString("#17945.[2].[5].property.[0].[0].arg[0].value.[2].arg[1].value.[0].arg[0].value", fallback: "Create \nAccount"))
                    .font(.custom(__designTimeString("#17945.[2].[5].property.[0].[0].arg[0].value.[2].arg[1].value.[0].modifier[0].arg[0].value.arg[0].value", fallback: "Alien"), size: __designTimeInteger("#17945.[2].[5].property.[0].[0].arg[0].value.[2].arg[1].value.[0].modifier[0].arg[0].value.arg[1].value", fallback: 36)))
                    .foregroundColor(.primary)
                    .multilineTextAlignment(.leading)
                    .frame(width: __designTimeInteger("#17945.[2].[5].property.[0].[0].arg[0].value.[2].arg[1].value.[0].modifier[3].arg[0].value", fallback: 321), height: __designTimeInteger("#17945.[2].[5].property.[0].[0].arg[0].value.[2].arg[1].value.[0].modifier[3].arg[1].value", fallback: 90), alignment: .bottomLeading)
                    
                ZStack{
                    TextField(__designTimeString("#17945.[2].[5].property.[0].[0].arg[0].value.[2].arg[1].value.[1].arg[0].value.[0].arg[0].value", fallback: "First name"), text: $firstname)
                        .textContentType(.emailAddress)
                        .keyboardType(.emailAddress)
                        .autocapitalization(.none)
                        .disableAutocorrection(__designTimeBoolean("#17945.[2].[5].property.[0].[0].arg[0].value.[2].arg[1].value.[1].arg[0].value.[0].modifier[3].arg[0].value", fallback: true))
                        .frame(width: __designTimeInteger("#17945.[2].[5].property.[0].[0].arg[0].value.[2].arg[1].value.[1].arg[0].value.[0].modifier[4].arg[0].value", fallback: 301), height: __designTimeInteger("#17945.[2].[5].property.[0].[0].arg[0].value.[2].arg[1].value.[1].arg[0].value.[0].modifier[4].arg[1].value", fallback: 45), alignment: .center)
                        .shadow(color: .secondary, radius: __designTimeInteger("#17945.[2].[5].property.[0].[0].arg[0].value.[2].arg[1].value.[1].arg[0].value.[0].modifier[5].arg[1].value", fallback: 4), x: __designTimeInteger("#17945.[2].[5].property.[0].[0].arg[0].value.[2].arg[1].value.[1].arg[0].value.[0].modifier[5].arg[2].value", fallback: 0), y: __designTimeInteger("#17945.[2].[5].property.[0].[0].arg[0].value.[2].arg[1].value.[1].arg[0].value.[0].modifier[5].arg[3].value", fallback: 0))
                        
                }
                        .frame(width: __designTimeInteger("#17945.[2].[5].property.[0].[0].arg[0].value.[2].arg[1].value.[1].modifier[0].arg[0].value", fallback: 321), height: __designTimeInteger("#17945.[2].[5].property.[0].[0].arg[0].value.[2].arg[1].value.[1].modifier[0].arg[1].value", fallback: 55), alignment: .center)
                ZStack{
                TextField(__designTimeString("#17945.[2].[5].property.[0].[0].arg[0].value.[2].arg[1].value.[2].arg[0].value.[0].arg[0].value", fallback: "Last name"), text: $lastname)
                    .textContentType(.emailAddress)
                    .keyboardType(.emailAddress)
                    .autocapitalization(.none)
                    .disableAutocorrection(__designTimeBoolean("#17945.[2].[5].property.[0].[0].arg[0].value.[2].arg[1].value.[2].arg[0].value.[0].modifier[3].arg[0].value", fallback: true))
                    .frame(width: __designTimeInteger("#17945.[2].[5].property.[0].[0].arg[0].value.[2].arg[1].value.[2].arg[0].value.[0].modifier[4].arg[0].value", fallback: 301), height: __designTimeInteger("#17945.[2].[5].property.[0].[0].arg[0].value.[2].arg[1].value.[2].arg[0].value.[0].modifier[4].arg[1].value", fallback: 45), alignment: .center)
                    .shadow(color: .secondary, radius: __designTimeInteger("#17945.[2].[5].property.[0].[0].arg[0].value.[2].arg[1].value.[2].arg[0].value.[0].modifier[5].arg[1].value", fallback: 4), x: __designTimeInteger("#17945.[2].[5].property.[0].[0].arg[0].value.[2].arg[1].value.[2].arg[0].value.[0].modifier[5].arg[2].value", fallback: 0), y: __designTimeInteger("#17945.[2].[5].property.[0].[0].arg[0].value.[2].arg[1].value.[2].arg[0].value.[0].modifier[5].arg[3].value", fallback: 0))
                    
            }
                ZStack{
                    TextField(__designTimeString("#17945.[2].[5].property.[0].[0].arg[0].value.[2].arg[1].value.[3].arg[0].value.[0].arg[0].value", fallback: "Email"), text: $email)
                        .textContentType(.password)
                        .autocapitalization(.none)
                        .disableAutocorrection(__designTimeBoolean("#17945.[2].[5].property.[0].[0].arg[0].value.[2].arg[1].value.[3].arg[0].value.[0].modifier[2].arg[0].value", fallback: true))
                        .frame(width: __designTimeInteger("#17945.[2].[5].property.[0].[0].arg[0].value.[2].arg[1].value.[3].arg[0].value.[0].modifier[3].arg[0].value", fallback: 301), height: __designTimeInteger("#17945.[2].[5].property.[0].[0].arg[0].value.[2].arg[1].value.[3].arg[0].value.[0].modifier[3].arg[1].value", fallback: 45), alignment: .center)
                        .shadow(color: .secondary, radius: __designTimeInteger("#17945.[2].[5].property.[0].[0].arg[0].value.[2].arg[1].value.[3].arg[0].value.[0].modifier[4].arg[1].value", fallback: 4), x: __designTimeInteger("#17945.[2].[5].property.[0].[0].arg[0].value.[2].arg[1].value.[3].arg[0].value.[0].modifier[4].arg[2].value", fallback: 0), y: __designTimeInteger("#17945.[2].[5].property.[0].[0].arg[0].value.[2].arg[1].value.[3].arg[0].value.[0].modifier[4].arg[3].value", fallback: 0))
                        
                        
                }
                        .frame(width: __designTimeInteger("#17945.[2].[5].property.[0].[0].arg[0].value.[2].arg[1].value.[3].modifier[0].arg[0].value", fallback: 321), height: __designTimeInteger("#17945.[2].[5].property.[0].[0].arg[0].value.[2].arg[1].value.[3].modifier[0].arg[1].value", fallback: 55), alignment: .center)
                ZStack{
                    TextField(__designTimeString("#17945.[2].[5].property.[0].[0].arg[0].value.[2].arg[1].value.[4].arg[0].value.[0].arg[0].value", fallback: "Password"), text: $password)
                        .textContentType(.emailAddress)
                        .keyboardType(.emailAddress)
                        .autocapitalization(.none)
                        .disableAutocorrection(__designTimeBoolean("#17945.[2].[5].property.[0].[0].arg[0].value.[2].arg[1].value.[4].arg[0].value.[0].modifier[3].arg[0].value", fallback: true))
                        .frame(width: __designTimeInteger("#17945.[2].[5].property.[0].[0].arg[0].value.[2].arg[1].value.[4].arg[0].value.[0].modifier[4].arg[0].value", fallback: 301), height: __designTimeInteger("#17945.[2].[5].property.[0].[0].arg[0].value.[2].arg[1].value.[4].arg[0].value.[0].modifier[4].arg[1].value", fallback: 45), alignment: .center)
                        .shadow(color: .secondary, radius: __designTimeInteger("#17945.[2].[5].property.[0].[0].arg[0].value.[2].arg[1].value.[4].arg[0].value.[0].modifier[5].arg[1].value", fallback: 4), x: __designTimeInteger("#17945.[2].[5].property.[0].[0].arg[0].value.[2].arg[1].value.[4].arg[0].value.[0].modifier[5].arg[2].value", fallback: 0), y: __designTimeInteger("#17945.[2].[5].property.[0].[0].arg[0].value.[2].arg[1].value.[4].arg[0].value.[0].modifier[5].arg[3].value", fallback: 0))
                        
                }
                        .frame(width: __designTimeInteger("#17945.[2].[5].property.[0].[0].arg[0].value.[2].arg[1].value.[4].modifier[0].arg[0].value", fallback: 321), height: __designTimeInteger("#17945.[2].[5].property.[0].[0].arg[0].value.[2].arg[1].value.[4].modifier[0].arg[1].value", fallback: 55), alignment: .center)
                
                Button(__designTimeString("#17945.[2].[5].property.[0].[0].arg[0].value.[2].arg[1].value.[5].arg[0].value", fallback: "Create Account")) {
                    ServerControl().register(email: email, password: password)
                        }
                    .frame(width: __designTimeInteger("#17945.[2].[5].property.[0].[0].arg[0].value.[2].arg[1].value.[5].modifier[0].arg[0].value", fallback: 321), height: __designTimeInteger("#17945.[2].[5].property.[0].[0].arg[0].value.[2].arg[1].value.[5].modifier[0].arg[1].value", fallback: 55), alignment: .center)
                    .background(Color(__designTimeString("#17945.[2].[5].property.[0].[0].arg[0].value.[2].arg[1].value.[5].modifier[1].arg[0].value.arg[0].value", fallback: "ButtonColorSL")))
                    .cornerRadius(__designTimeInteger("#17945.[2].[5].property.[0].[0].arg[0].value.[2].arg[1].value.[5].modifier[2].arg[0].value", fallback: 15))
                    .foregroundColor(.white)
                
            Divider()
                    .frame(width: __designTimeInteger("#17945.[2].[5].property.[0].[0].arg[0].value.[2].arg[1].value.[6].modifier[0].arg[0].value", fallback: 321))
                
            Button(__designTimeString("#17945.[2].[5].property.[0].[0].arg[0].value.[2].arg[1].value.[7].arg[0].value", fallback: "Login")) {
                selectedbutton = .login
                    
            }
                .frame(width: __designTimeInteger("#17945.[2].[5].property.[0].[0].arg[0].value.[2].arg[1].value.[7].modifier[0].arg[0].value", fallback: 321), height: __designTimeInteger("#17945.[2].[5].property.[0].[0].arg[0].value.[2].arg[1].value.[7].modifier[0].arg[1].value", fallback: 55), alignment: .center)
                .background(Color(__designTimeString("#17945.[2].[5].property.[0].[0].arg[0].value.[2].arg[1].value.[7].modifier[1].arg[0].value.arg[0].value", fallback: "ButtonColorSL")))
                .cornerRadius(__designTimeInteger("#17945.[2].[5].property.[0].[0].arg[0].value.[2].arg[1].value.[7].modifier[2].arg[0].value", fallback: 15))
                .foregroundColor(.white)
            }
                .padding(__designTimeInteger("#17945.[2].[5].property.[0].[0].arg[0].value.[2].modifier[0].arg[0].value", fallback: 20))
            }
    .padding(.top, __designTimeInteger("#17945.[2].[5].property.[0].[0].modifier[0].arg[1].value", fallback: 210))

#sourceLocation()
    }
}

import struct Trade_Marketplace.ContentSignup
