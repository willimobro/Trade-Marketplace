//
//  LoginView.swift
//  Trade Marketplace
//
//  Created by William larsen on 14/09/22.
//

import SwiftUI

struct LoginView: View {
    @Binding var selectedbutton : Views
    var body: some View {
                    ZStack{
                        BackgroundLogo_Secoundary()
                        ContentLogin( selectedbutton: $selectedbutton)
                        VStack{
                            Image("loginphone")
                                .resizable()
                                .frame(width: 282  , height: 281)
                                .shadow(color: .secondary, radius: 4, x: 0, y: 0)
                            Spacer()
                        }
                        .frame(minWidth: 300, idealWidth: 282, maxWidth: .infinity, minHeight: 282, idealHeight: 281, maxHeight: .infinity, alignment: .center)
                            .padding(.top, 65)
                    }
    }
}




import SwiftUI

struct Back: View {
    var body: some View {
        ZStack{
            VStack{
            HStack(spacing: 7.0){
            LogoView()
                .frame(width: 25.78, height: 42.67)
                .foregroundColor(Color("logogreen"))
                .padding(.leading, 35)
                Text("TRADE MARKETPLACE")
                    .font(.subheadline)
                .foregroundColor(.white)
                .fontWeight(.bold)
                .frame(width: 145, height: 42.46, alignment: .topLeading)
                
            Spacer()
            
                
            }
        }
            
        .frame(maxHeight: .infinity, alignment: .topLeading)
            LogoView()
                .ignoresSafeArea()
                .foregroundColor(Color("logogreen"))
                .blendMode(.screen)
                .opacity(0.2)
                .frame(width: 419, height: 693.55, alignment: .top)
                .padding(.top, -500)
                // align logo a bit higher
        
        }.background(Color("CanvasColor"))
    }
                         
}
struct Back_Previews: PreviewProvider {
    static var previews: some View {
        Back()
    }
}
