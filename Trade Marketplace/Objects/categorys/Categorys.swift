//
//  Categorys.swift
//  Trade Marketplace
//
//  Created by William larsen on 16/09/22.
//

import SwiftUI

struct Categorys: View {
    var body: some View {
        NavigationLink(destination: CategoryView(returnable: true)){
                RoundedRectangle(cornerRadius: 11)
                    .frame(width: 129, height: 172)
                    .foregroundColor(.white)
                    .shadow(color:Color("dropshadow25"), radius: 8, x: 0, y: 6)
                    .overlay(
                        VStack{
                            ZStack{
                                RoundedRectangle(cornerRadius: 11)
                                    .frame(width: 92, height: 92)
                                    .foregroundColor(Color("categoryimagecolor1"))
                                    .opacity(0.3)
                                Image("categoryimage1")
                            }
                            Text("Electrical")
                                .font(.headline)
                                .fontWeight(.bold)
                                .foregroundColor(.black)
                            Text("and related")
                                .font(.subheadline)
                                .fontWeight(.regular)
                                .foregroundColor(.gray)
                            
                        })
        }
    }
}

struct Categorys_Previews: PreviewProvider {
    static var previews: some View {
        Categorys()
    }
}
