//
//  ContentLogin.swift
//  Trade Marketplace
//
//  Created by William larsen on 14/09/22.
//

import SwiftUI

struct ContentLogin: View {
    @Binding var selectedbutton : Views
    @State var text = ""
    @State var password = ""
    @State var loginactive  = false
    @State var signinactive = false
    
    var body: some View {
        ZStack{
            Rectangle()
                .foregroundColor(.white)
                .ignoresSafeArea()
            
            
            Spacer()
            VStack(spacing: 20) {
                Text("Welcome \nBack")
                    .font(.largeTitle)
                    .fontWeight(.semibold)
                    .foregroundColor(.primary)
                    .multilineTextAlignment(.leading)
                    .frame(width: 321, height: 90, alignment: .bottomLeading)
                    
                ZStack{
                    TextField("Email address", text: $text)
                        .textContentType(.emailAddress)
                        .keyboardType(.emailAddress)
                        .autocapitalization(.none)
                        .disableAutocorrection(true)
                        .frame(width: 301, height: 45, alignment: .center)
                        .shadow(color: .secondary, radius: 4, x: 0, y: 0)
                        
                }
                .frame(width: 321, height: 55, alignment: .center)
                ZStack{
                    TextField("Password", text: $password)
                        .textContentType(.password)
                        .autocapitalization(.none)
                        .disableAutocorrection(true)
                        .frame(width: 301, height: 45, alignment: .center)
                        .shadow(color: .secondary, radius: 4, x: 0, y: 0)
                        
                        
                }
                Button("Forgot Password?"){
                    print("hello")
                }
                    .font(.caption)
                    .foregroundColor(Color("ButtonColorSL"))
                    .multilineTextAlignment(.trailing)
                    .frame(width: 321, height: 40, alignment: .trailing)
                
                Button("Login") {
                    print("hello")
                        }
                    .frame(width: 321, height: 55, alignment: .center)
                    .background(Color("ButtonColorSL"))
                    .cornerRadius(15)
                    .foregroundColor(.white)
                
            Divider()
                    .frame(width: 321)
                
            Button("Sign Up") {
                selectedbutton = .signup
                    
            }
                .frame(width: 321, height: 55, alignment: .center)
                .background(Color("ButtonColorSL"))
                .cornerRadius(15)
                .foregroundColor(.white)
            }
                .padding(20)
            }
    .padding(.top, 300)
}
}

