//
//  COntentHome.swift
//  Trade Marketplace
//
//  Created by William larsen on 17/09/22.
//

import SwiftUI

struct ContentHome: View {
    var body: some View {
        VStack{
            VStack{
            Text("Open Jobs")
                    .font(.custom("Poppins-SemiBold", size: 28))
                    .fontWeight(.semibold)
                    .frame(width: 170, height: 36, alignment: .leading)
                    .foregroundColor(.black)
            Text("*0* open jobs")
                    .font(.custom("Poppins-SemiBold", size: 14))
                    .fontWeight(.regular)
                    .multilineTextAlignment(.leading)
                    .frame(width: 170, height: 32, alignment: .leading)
                    .foregroundColor(.gray)
        }
        .frame(width: 321, height: 70, alignment: .leading)
    ScrollView(.horizontal){
        VStack(spacing: 15)
        {
            HStack(spacing: 15){
                Rectangle()
                .frame(width: 20, height: 170)
                .opacity(0)
//                MainObject()
//                MainObject()
//                MainObject()
//                MainObject()
//                MainObject()
//                MainObject()
//                MainObject()
//                MainObject()
            }
            HStack(spacing: 15){
                Rectangle()
                .frame(width: 20, height: 170)
                .opacity(0)
//                MainObject()
//                MainObject()
//                MainObject()
//                MainObject()
//                MainObject()
//                MainObject()
//                MainObject()
//                MainObject()
                
            }
        }
        .frame(height: 350, alignment: .leading)
    }
        VStack{
        Text("Open Jobs")
                .font(.custom("Poppins-SemiBold", size: 28))
                .frame(width: 170, height: 36, alignment: .leading)
                .foregroundColor(.black)
        Text("*0* open jobs")
                .font(.custom("Poppins-SemiBold", size: 14))
                .fontWeight(.regular)
                .multilineTextAlignment(.leading)
                .frame(width: 170, height: 32, alignment: .leading)
                .foregroundColor(.gray)
    }
    .frame(width: 321, height: 70, alignment: .leading)
ScrollView(.horizontal){
    VStack(spacing: 15)
    {
        HStack(spacing: 15){
            Rectangle()
            .frame(width: 20, height: 170)
            .opacity(0)
//            MainObject()
//            MainObject()
//            MainObject()
//            MainObject()
//            MainObject()
//            MainObject()
//            MainObject()
//            MainObject()
        }
        
    }
    .frame(height: 350, alignment: .leading)
}
    
}
}
}
struct ContentHome_Previews: PreviewProvider {
    static var previews: some View {
        ContentHome()
    }
}
