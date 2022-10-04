//
//  BackgroundLogo_Secoundary.swift
//  Trade Marketplace
//
//  Created by William larsen on 16/09/22.
//

import SwiftUI

struct BackgroundLogo_Secoundary: View {
    var body: some View {
        ZStack{
            VStack{
            HStack(spacing: 7.0){
                Button{
                    print("yoyo")
                }
                label:    {
                    Image(systemName:"chevron.backward.circle.fill")
                }
                .frame(width: 150, height: 30, alignment: .leading)
                .foregroundColor(Color("logogreen"))
            LogoView()
                .frame(width: 25.78, height: 42.67)
                .foregroundColor(Color("logogreen"))
                .frame(width: 150, height: 42.46, alignment: .topTrailing)

                
            
                
            }.frame(width: .infinity, height: .infinity, alignment: .trailing)
        }
            
        .frame(maxHeight: .infinity, alignment: .top)
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
struct BackgroundLogo_Secoundary_Previews: PreviewProvider {
    static var previews: some View {
        BackgroundLogo_Secoundary()
    }
}
